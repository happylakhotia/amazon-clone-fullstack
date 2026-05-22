import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// Initialize Stripe if secret key is present
const stripe = stripeSecretKey.trim() !== "" 
  ? new Stripe(stripeSecretKey) 
  : null;

export default stripe;
