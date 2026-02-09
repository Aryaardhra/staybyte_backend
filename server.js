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
const PORT = process.env.PORT || 3002;
connectDB();
await connectCloudinary();

//const allowedOrigins = [ "https://staybyte-frontend-3jy4bf2b9-ardhras-projects-261e273a.vercel.app" || "http://localhost:5173" ]



//middlewares
// ✅ CORS setup
app.use(cors({
    origin: "https://staybyte-frontend-3jy4bf2b9-ardhras-projects-261e273a.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(clerkMiddleware());


{/*
// ✅ Bypass test route FIRST (before /api/clerk)
app.post("/test/clerk", express.json(), async (req, res) => {
  try {
    const clerkPayload = {
      type: "user.created",
      data: {
        id: "user_test123clerk",
        email_addresses: [{ email_address: "testuserc@example.com" }],
        first_name: "Testc",
        last_name: "Userc",
        image_url: "https://example.com/avatar.png"
      }
    };

    const newUser = await userModel.create({
      _id: clerkPayload.data.id,
      email: clerkPayload.data.email_addresses[0].email_address,
      username: `${clerkPayload.data.first_name} ${clerkPayload.data.last_name}`,
      image: clerkPayload.data.image_url,
    });

    res.json({ success: true, message: "Simulated Clerk user created", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
/*
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
// ✅ Clerk Webhook route — must come BEFORE express.json()

/*
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }), // raw body for signature verification
  clerkWebhooks
);*/
/*
app.post("/api/clerk", express.raw({ type: "application/json" }), (req, res, next) => {
  console.log("🔥 Webhook hit at:", new Date().toISOString());
  console.log("📩 Headers:", req.headers);
  console.log("📩 Raw body:", req.body.toString("utf8"));
  next();
}, clerkWebhooks);*/

/*
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    console.log("🔥 Webhook hit at:", new Date().toISOString());
    console.log("📩 Headers:", req.headers);
    console.log("📩 Raw body:", req.body.toString("utf8"));
    next();
  },
  clerkWebhooks
);*/


// ✅ Parse JSON for all other requests


/*=====================================================================*/
/*
// ✅ Bypass test route FIRST (before /api/clerk)
app.post("/test/clerk", express.json(), async (req, res) => {
  try {
    const clerkPayload = {
      type: "user.created",
      data: {
        id: "user_test123",
        email_addresses: [{ email_address: "testuser@example.com" }],
        first_name: "Test",
        last_name: "User",
        image_url: "https://example.com/avatar.png"
      }
    };

    

    const newUser = await userModel.create({
      _id: clerkPayload.data.id,
      email: clerkPayload.data.email_addresses[0].email_address,
      username: `${clerkPayload.data.first_name} ${clerkPayload.data.last_name}`,
      image: clerkPayload.data.image_url,
    });

    res.json({ success: true, message: "Simulated Clerk user created", user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});*/


/*=================================================================================*/

// Clerk real webhook handler
/*
const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify the request came from Clerk
    const event = await whook.verify(req.body.toString(), headers);
    const { data, type } = event;

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await userModel.create(userData);
        break;
      case "user.updated":
        await userModel.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await userModel.findByIdAndDelete(data.id);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};*/}
app.use(express.json());

// Important: express.raw() for Clerk webhook route
//app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// Apply express.json() for the rest of the routes


//api endpoints

app.get("/", (req,res) => {
    res.send("API working")
});

app.use('/api/inngest', serve({ client: inngest, functions }))

app.use("/api/stripe", express.raw({type: "application/json"}), stripeWebhooks)
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
});