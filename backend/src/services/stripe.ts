import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_for_dev';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2026-02-25.clover', // or whatever your latest/supported version is
});

export const createCheckoutSession = async ({
  bookingId,
  amount,
  currency = 'usd',
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  bookingId: string;
  amount: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `Booking #${bookingId}`,
              description: 'SurfBook Reservation',
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
};
