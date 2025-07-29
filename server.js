import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";
import {clerkMiddleware} from "@clerk/express"
import clerkWebhooks from "./controllers/clerkWebhooks.js";

dotenv.config();
//app config

const app = express();
const PORT = process.env.PORT || 3002;
connectDB();


const allowedOrigins = [ "http://localhost:5173" ]



//middlewares

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(clerkMiddleware())

//api to listen to clerk webhooks
app.use("/api/clerk", clerkWebhooks)

//api endpoints

app.get("/", (req,res) => {
    res.send("API working")
});


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
});