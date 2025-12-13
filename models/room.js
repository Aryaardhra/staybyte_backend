import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({

  hotel : {
    type : String,
    ref : "hotel",
    required : true
  },
  roomType : {
     type : String,
     required : true
  },
  pricePerNight : {
    type : Number,
    required : true
  },
  amenities : {
    type : Array,
    required : true
  },
  images : [{
    type : String
  }],
  isAvailable : {
    type : Boolean,
    default : true
  }
}, { timestamps : true });

const roomModel = mongoose.models.room || mongoose.model("room", roomSchema);

export default roomModel;