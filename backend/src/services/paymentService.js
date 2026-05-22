import stripe from "../config/stripe.js";

// Create a Stripe PaymentIntent or simulated payment token if keys are absent
export const createPaymentIntent = async (amount, currency = "inr") => {
  if (stripe) {
    try {
      // Stripe amount must be in the smallest currency unit
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: { integration: "amazon_clone_checkout" },
      });
      return {
        clientSecret: intent.client_secret,
        id: intent.id,
        isSimulated: false,
      };
    } catch (error) {
      console.warn("Stripe API failed. Gracefully falling back to simulated checkout...", error.message);
    }
  }

  // Graceful simulated gateway fallback for development & blank credential states
  const simulatedId = `ch_sim_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const clientSecret = `pi_sim_secret_${Math.random().toString(36).substring(2, 15)}`;

  return {
    clientSecret,
    id: simulatedId,
    isSimulated: true,
  };
};

export default { createPaymentIntent };
