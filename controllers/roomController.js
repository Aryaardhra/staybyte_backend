//import connectCloudinary from "../configs/cloudinary.js";
import hotelModel from "../models/hotel.js";
import roomModel from "../models/room.js";
import { v2 as cloudinary } from "cloudinary";
//api to create a new room for a hotel

export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await hotelModel.findOne({ owner : req.auth.userId });
        
        if(!hotel)
            return res.json({ success : false, message : "No Hotel Found"})

        //upload images to cloudinary
        const uploadImages = req.files.map(async(file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        //wait for all uploads to complete

        const images = await Promise.all(uploadImages);

        await roomModel.create({
            hotel : hotel._id,
            roomType,
            pricePerNight : +pricePerNight,
            amenities : JSON.parse(amenities),
            images,
        })
        res.json({ success : true, message : "Room Created Successfully"})
    } catch (error) {
        res.json({ success : false, message : error.message })
    }
};

//api to get all rooms

export const getRooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({isAvailable : true}).populate({
            path : "hotel",
            populate : {
                path : "owner",
                select : "image"
            }
        }).sort({createdAt : -1})
        res.json({ success : true, rooms})
    } catch (error) {
        res.json({ success : false, message: error.message})
    }
};

//api to get all rooms for a specific hotel

export const getOwnerRooms = async (req, res) => {
    try {
       const hotelData = await hotelModel.findOne({ owner : req.auth.userId });
       const rooms = await roomModel.find({ hotel : hotelData._id.toString()}).populate("hotel");
       res.json({ success : true, rooms }); 
    } catch (error) {
        res.json({ success : false, message : error.message });
    }
};

//api to toggle availability of a room

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await roomModel.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success:true, message : "Room avilability updated"})
    } catch (error) {
        res.json({ success : false, message : error.message})
    }
}