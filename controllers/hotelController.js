import hotelModel from "../models/hotel.js";
import userModel from "../models/User.js";

export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;
//console.log("user:",req.user._id );
      //  console.log("OWNER:", owner);

        const hotel = await hotelModel.findOne({ owner });

        if (hotel) {
            return res.status(400).json({ success: false, message: "Hotel Already Registered" });
        }

        await hotelModel.create({ name, address, contact, city, owner });
        await userModel.findByIdAndUpdate(owner, { role: "hotelOwner" });

        return res.status(201).json({ success: true, message: "Hotel Registered Successfully" });

    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: error.message });
        } else {
            console.error("Error occurred after response sent:", error.message);
        }
    }
};