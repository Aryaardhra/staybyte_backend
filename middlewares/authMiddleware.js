
import { clerkClient} from '@clerk/express';
import userModel from '../models/User.js';

export const protect = async (req, res, next) => {
   const { userId } = await req.auth() || {};
  /// const { userId } = getAuth(req); // no need to await
    //const auth = await req.auth();
    

    //console.log(userId)
  if(!userId) {
    res.json({ success : false, message : "not authenticated"})
  } else {
      const clerkUser = await clerkClient.users.getUser(userId);
    req.user = clerkUser;
    req.userId = userId;
     const user = await userModel.findById(userId);
    req.user = user;
    next();
  }
};

/*
export const protect = async (req, res, next) => {
  const { userId } = getAuth(req); // ✅ correct usage with clerkMiddleware()

  console.log("userId from Clerk:", userId);

  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    const user = await userModel.findById(userId);
    req.user = user;
    next();
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};*/

/*
export const protect = async (req, res, next) => {
 // const { userId } = getAuth(req);
 const { userId } = await req.auth() || {};
  console.log("USER ID:", userId); // debug log

  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const user = await userModel.findById(userId);
  req.user = user;
  next();
};*/

//import { clerkClient } from "@clerk/express";
/*
import { verifySessionToken } from "@clerk/backend"

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const { session, userId } = await verifySessionToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    req.user = clerkUser;
    req.userId = userId;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};*/