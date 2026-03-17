import express, { Response } from "express";
import { stripe } from "../services/stripe";
import Booking from "../models/Booking";
import Payment from "../models/Payment";
import Customer from "../models/Customer";
import { createCheckoutSession } from "../services/stripe";

const router = express.Router();

export const stripeWebhookController = async (req: express.Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test";

  let event;

  try {
    if (endpointSecret === "whsec_test") {
      // bypass verification for local testing if no secret provided, just parsing json
       event = JSON.parse(req.body.toString());
    } else {
       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = "paid";
        await booking.save();

        // Create a payment record
        const payment = new Payment({
          bookingId: booking._id,
          companyId: booking.companyId,
          customerId: booking.customerId,
          amount: session.amount_total, // Stripe returns amount in cents
          method: "credit_card",
          status: "completed",
          type: "full",
          paidAt: new Date(),
          notes: `Stripe transaction: ${session.payment_intent}`,
        });
        await payment.save();
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send({ received: true });
};

// ================================
// STRIPE CHECKOUT SESSION
// ================================
router.post("/checkout", async (req: express.Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("customerId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const amount = booking.totalPrice; 
    const customer = booking.customerId as any;

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      bookingId: booking._id!.toString(),
      amount,
      successUrl: `${frontendUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking._id}`,
      cancelUrl: `${frontendUrl}/booking/confirmation/${booking._id}?canceled=true`,
      customerEmail: customer?.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
});

export default router;