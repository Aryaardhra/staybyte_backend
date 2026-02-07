import stripe from "stripe";
import bookingModel from "../models/bookings";

export const stripeWebhooks = async (request, response) => {
    //stripe gateway initialize 
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        response.status(400).send(`Webhook Error : ${err.message}`)
    }

    // handle the event
     
    if(event.type === "payment_intent.succeeded"){
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        //getting session metadata

        const session = await stripeInstance.checkout.sessions.list({
            payment_intent : paymentIntentId
        });

        const { bookingId } = session.data[0].metadata;

        // mark payment as paid

        await bookingModel.findByIdAndUpdate(bookingId, {isPaid: true, paymentMethod: "Stripe"})
    }
    else{
        console.log("Unhandle event type : ", event.type)
    }
    response.json({ received: true})
}