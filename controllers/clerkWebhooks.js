import { Webhook } from "svix";
import userModel from "../models/user.js";
import connectDB from "../configs/db.js";

/*
const clerkWebhooks = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ success: false, message: "Missing CLERK_WEBHOOK_SECRET" });
  }

  // ✅ Check if it's a real Clerk request (headers present)
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ success: false, message: "Missing required headers" });
  }

  const payload = JSON.stringify(req.body);
  const headers = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  try {
    // ✅ Verify signature
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    if (evt.type === "user.created") {
      const userData = evt.data;

      await userModel.create({
        _id: userData.id,
        email: userData.email_addresses[0].email_address,
        username: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        image: userData.image_url,
      });
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export default clerkWebhooks;
/*
const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔔 Incoming Clerk webhook...");

    // Grab raw body for verification
    const payloadString = req.body.toString("utf8");

    // Headers for verification
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };
    console.log("📌 Webhook headers:", headers);

    let isVerified = false;

    // Verify signature (skip only if headers missing — DEBUG ONLY)
    if (headers["svix-id"] && headers["svix-signature"] && headers["svix-timestamp"]) {
      try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(payloadString, headers);
        isVerified = true;
        console.log("✅ Signature verified.");
      } catch (err) {
        console.error("❌ Signature verification failed:", err.message);
      }
    } else {
      console.warn("⚠️ Missing Clerk signature headers — skipping verification (DEBUG MODE)");
    }

    // Parse the payload
    const { data, type } = JSON.parse(payloadString);
    console.log("📦 Webhook type:", type);
    console.log("📦 User data:", data);

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    switch (type) {
      case "user.created":
        await userModel.create(userData);
        console.log("🆕 User created:", userData._id);
        break;

      case "user.updated":
        await userModel.findByIdAndUpdate(data.id, userData);
        console.log("♻️ User updated:", userData._id);
        break;

      case "user.deleted":
        await userModel.findByIdAndDelete(data.id);
        console.log("🗑 User deleted:", data.id);
        break;

      default:
        console.log("ℹ️ Unhandled webhook type:", type);
    }

    return res.json({
      success: true,
      verified: isVerified,
      message: "Webhook processed",
    });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
/*
const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Extract Clerk signature headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Ensure all required headers are present
    if (!headers["svix-id"] || !headers["svix-timestamp"] || !headers["svix-signature"]) {
      return res.status(400).json({ success: false, message: "Missing required headers" });
    }

    // Get raw body string
    const payloadString = req.body.toString("utf8");

    // Verify webhook signature
    whook.verify(payloadString, headers);

    // Parse the JSON payload
    const { data, type } = JSON.parse(payloadString);

    // Build user object
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || null,
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
      role: "user",
      recentSearchedCities: [],
    };

    // Handle Clerk events
    if (type === "user.created") {
      await userModel.create(userData);
    } else if (type === "user.updated") {
      await userModel.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
    } else if (type === "user.deleted") {
      await userModel.findByIdAndDelete(data.id);
    }

    // Send one response only
    return res.status(200).json({ success: true, message: "Webhook processed" });

  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
/*
*/
/*
const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        await whook.verify(JSON.stringify(req.body), headers);

        const { data, type } = req.body;
/*
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email.address,
            username: data.first_name + "" + data.last_name,
            image: data.image_url,
        };*/
/*
        switch (type) {
            case "user.created":
                  const userData = {
            _id: data.id,
            email: data.email_addresses[0].email.address,
            username: data.first_name + "" + data.last_name,
            image: data.image_url,
        };
                const newUser = await userModel.create(userData);
                return res.json({ success: true, user: newUser });

            case "user.updated":
                const updatedUser = await userModel.findByIdAndUpdate(data.id, userData, { new: true });
                return res.json({ success: true, user: updatedUser });

            case "user.deleted":
                await userModel.findByIdAndDelete(data.id);
                return res.json({ success: true });

            default:
                return res.json({ success: true, message: "Unhandled webhook type" });
        }

    } catch (error) {
        console.log("Webhook error:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
/*
 const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await whook.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email.address,
       username : data.first_name + "" + data.last_name,
      image: data.image_url,
    };

    let message = "Unhandled webhook type";

    switch (type) {
      case "user.created":
        await userModel.create(userData);
        message = "User created";
        break;

      case "user.updated":
        await userModel.findByIdAndUpdate(data.id, userData, { new: true });
        message = "User updated";
        break;

      case "user.deleted":
        await userModel.findByIdAndDelete(data.id);
        message = "User deleted";
        break;
    }

    return res.status(200).json({ success: true, message });

  } catch (error) {
    console.error("Webhook error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
*/

//import { Webhook } from "svix";
//import userModel from "../models/userModel.js";

/*
 const clerkWebhooks = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ success: false, message: "Missing CLERK_WEBHOOK_SECRET" });
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("❌ Missing Clerk headers:", { svix_id, svix_timestamp, svix_signature });
    return res.status(400).json({ success: false, message: "Missing required headers" });
  }

  const payload = req.body.toString("utf8"); // raw buffer → string
  const headers = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    console.log("✅ Webhook event received:", evt.type);

    if (evt.type === "user.created") {
      const userData = evt.data;
      console.log("📦 Clerk user data:", userData);

      await userModel.create({
        _id: userData.id,
        email: userData.email_addresses[0].email_address,
        username: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        image: userData.image_url,
      });

      console.log("✅ User saved in DB");
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

*/
/*

const clerkWebhooks = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ success: false, message: "Missing CLERK_WEBHOOK_SECRET" });
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ success: false, message: "Missing required headers" });
  }

  const payload = req.body.toString("utf8");
  const headers = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    console.log("✅ Webhook verified:", evt.type);

    if (evt.type === "user.created") {
      const userData = evt.data;

      await userModel.create({
        _id: userData.id,
        email: userData.email_addresses[0].email_address,
        username: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
        image: userData.image_url,
      });

      console.log("✅ User saved:", userData.id);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
*/




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
    await whook.verify(req.body.toString(), headers);

    const { data, type } = JSON.parse(req.body); // parse after verify

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address, // ✅ FIXED
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

      default:
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.log("Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
*/


export const config = {
  api: { bodyParser: false }, // disable default parsing
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const rawBody = await buffer(req);

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    wh.verify(rawBody.toString(), headers);

    const { data, type } = JSON.parse(rawBody.toString());

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    if (type === "user.created") {
      await userModel.create(userData);
    } else if (type === "user.updated") {
      await userModel.findByIdAndUpdate(data.id, userData);
    } else if (type === "user.deleted") {
      await userModel.findByIdAndDelete(data.id);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
}

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
