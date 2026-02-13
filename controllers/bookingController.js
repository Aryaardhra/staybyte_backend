import stripe from "stripe";
import transporter from "../configs/nodemailer.js";
import bookingModel from "../models/bookings.js";
import hotelModel from "../models/hotel.js";
import roomModel from "../models/room.js";

// function to check availability of room

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await bookingModel.find({
            room,
            checkInDate : {$lte : checkOutDate},
            checkOutDate : {$gte : checkInDate},
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
};

//api to check availability of room
//POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room});
        res.json({ success : true, isAvailable})
    } catch (error) {
        res.json({ success : false, message : error.message })
    }
};

//api to create a new booking
//POST /api/bookings/book

export const createBooking = async(req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        //before booking check availability

        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if(!isAvailable){
            return res.json({ success : false, message : "Room is not available"})
        }

        //get totalPrice from room

        const roomData = await roomModel.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // calculate totalprice based on nights

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice*= nights;

        const booking = await bookingModel.create({
            user,
            room,
            hotel : roomData.hotel._id,
            guests : +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : req.user.email,
            subject : "Hotel Booking Details",
            html : `
            <h2>Your Booking Details</h2>
            <p>Dear ${req.user.username},</p>
            <p>Thank you for your booking! Here are your details:</p>
            <ul>
            <li><strong>Booking ID : </strong> ${booking._id}</li>
            <li><strong>Hotel Name</strong> ${roomData.hotel.name}</li>
            <li><strong>Location</strong>${roomData.hotel.address}</li>
            <li><strong>Date : </strong>${booking.checkInDate.toDateString()}</li>
            <li><strong>Booking Amount</strong>${process.env.CURRENCY || "₹"} ${booking.totalPrice}/night</li>
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>
            `
        }

        await transporter.sendMail(mailOptions)
        res.json({ success : true, message : "Booking created successfully"})
    } catch (error) {
        console.log(error);
        res.json({ success : false, message : "Failed to create booking"})
    }
};

//api to get all bookings for a user
// GET/api/bookings/user

export const getUserBookings = async(req, res) => {
    try {
        const user = req.user._id;
        const bookings = await bookingModel.find({user}).populate("room hotel").sort({ createdAt : -1});

        res.json({ success : true, bookings })
    } catch (error) {
        res.json({ success : false, message:"Failed to fetch bookings"});
    }
};

export const getHotelBookings = async (req, res) => {
    try {
       const hotel = await hotelModel.findOne({ owner : req.auth.userId });
       if(!hotel){
        return res.json({ success : false, message : "No hotel found"})
       }
       const bookings = await bookingModel.find({ hotel : hotel._id}).populate("room hotel user").sort({ createdAt: -1});

       //total bookings
       const totalBookings = bookings.length;

       //total revenue

       const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

       res.json({ success : true, dashboardData : { totalBookings, totalRevenue, bookings}});

    } catch (error) {
        res.json({ success : false, message : "Failed to fetch bookings"});
    }
}

export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;

        const booking = await bookingModel.findById(bookingId);
        const roomData = await roomModel.findById(booking.room).populate("hotel");
        const totalPrice = booking.totalPrice;
        const { origin } = req.headers;

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data : {
                    currency : "inr",
                    product_data : {
                        name : roomData.hotel.name,
                    },
                    unit_amount: totalPrice *100
                },
                quantity : 1,
            }
        ]

        //ctreate checkout session

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode : "payment",
            success_url : `${origin}/loader/my-bookings`,
            cancel_url : `${origin}/my-bookings`,
            metadata : {
                bookingId,
            }
        })
          res.json({ success : true, url: session.url})
    } catch (error) {
        res.json({ success : false, message : "Payment failed"})
    }
}