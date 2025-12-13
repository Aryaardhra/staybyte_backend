
 import userModel from "./models/user.js";
 /*
const payload = {
  data: {
    id: "user_12345", // test ID
    email_addresses: [
      { email_address: "testuser@example.com" }
    ],
    first_name: "Test4",
    last_name: "User",
    image_url: "https://example.com/avatar.png"
  },
  type: "user.created"
};

(async () => {
  try {
    const res = await axios.post("http://localhost:3000/api/clerk", payload, {
      headers: {
        "Content-Type": "application/json",
        // Bypass Clerk's signature check in dev mode by commenting verify step in clerkWebhooks.js
      }
    });
    console.log("Response:", res.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
})();*/

/*
==========================================================================================
/*
 import userModel from "./models/user.js";*/
/*
app.post("/test/clerk", express.json(), async (req, res) => {
  try {
    const clerkPayload = {
      type: "user.created",
      data: {
        id: "user_123456789",
        email_addresses: [
          { email_address: "testuser@example.com" }
        ],
        first_name: "Test",
        last_name: "User",
        image_url: "https://example.com/avatar.png"
      }
    };

    // Import your user model
   

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

// Bypass Clerk verification for local testing
/*

app.post("/api/clerk", express.json(), async (req, res) => {
  try {
    const clerkPayload = {
      type: "user.created",
      data: {
        id: "user_test123",
        email_addresses: [
          { email_address: "testuser@example.com" }
        ],
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
});
*/

import fetch from "node-fetch";

const TEST_URL = "https://staybyte-backend.vercel.app/api/clerk"; // Change this

async function testWebhook() {
  const fakeBody = JSON.stringify({
    type: "user.created",
    data: {
      id: "user_test123",
      email_addresses: [{ email_address: "testuser@example.com" }],
      first_name: "Test",
      last_name: "User",
      image_url: "https://example.com/avatar.png",
    },
  });

  const nowInSeconds = Math.floor(Date.now() / 1000);

  const res = await fetch(TEST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "svix-id": "test-id",
      "svix-timestamp": nowInSeconds.toString(), // ✅ seconds, not ms
      "svix-signature": "test-signature", // won't pass verification (this is just for testing)
    },
    body: fakeBody,
  });

  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}

testWebhook();