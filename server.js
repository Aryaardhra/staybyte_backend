import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import {clerkMiddleware} from "@clerk/express"
//import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRouter.js";
import roomRouter from "./routes/roomRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import {serve} from "inngest/express";
import {inngest, functions} from "./inngest/index.js";
import connectCloudinary from "./configs/cloudinary.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

//import {serve} from "inngest/express";
//import {  functions, inngest } from "./inngest/index.js";
//import {serve} from "inngest/express"
//import {inngest, functions} from "./inngest/index.js"
//import userModel from "./models/user.js";
//import { Webhook } from "svix";
//app config

const app = express();
dotenv.config();
const port = process.env.PORT || 4002;
await connectDB();
await connectCloudinary();

app.post("/api/stripe", express.raw({type: "application/json"}), stripeWebhooks)

app.use(express.json());

//middlewares
// ✅ CORS setup

//app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cors({
    origin: process.env.NODE_ENV === "production" ? "https://staybyte-frontend.vercel.app" : "http://localhost:5173" ,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(clerkMiddleware());

app.get("/", (req,res) => {
    res.send("API working")
});

app.use('/api/inngest', serve({ client: inngest, functions }))

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);


app.listen(port, () => {
    console.log(`server started on port ${port}`)
});