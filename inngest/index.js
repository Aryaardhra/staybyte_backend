import { Inngest } from "inngest";
import userModel from "../models/User.js";




// Create a client to send and receive events
export const inngest = new Inngest({ id: "staybyte" });

// Inngest Function to save user data to a database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        const {id,  email_addresses, image_url, role} = event.data
        let username = email_addresses[0].email_address.split('@')[0]

        // Check availability of username
        const user = await userModel.findOne({username})

        if (user) {
            username = username + Math.floor(Math.random() * 10000)
        }

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            image: image_url,
            role,
            username
        }
        await userModel.create(userData)
        
    }
)

// Inngest Function to update user data in database 
const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event})=>{
        const {id, email_addresses, image_url, role} = event.data
        
    const updatedUserData = {
        email:  email_addresses[0].email_address,
        role,
        image: image_url
    }
    await userModel.findByIdAndUpdate(id, updatedUserData)
        
    }
)

// Inngest Function to delete user from database
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event})=>{
        const {id} = event.data
        await userModel.findByIdAndDelete(id)
    }
)
{/*
// Inngest Function to send Reminder when a new connection request is added


*/}
// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
 
];