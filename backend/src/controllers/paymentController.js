import * as paymentService from "../services/paymentService.js";
import * as cartService from "../services/cartService.js";
import { calculateOrderTotals } from "../utils/calculateTotal.js";
import { DEFAULT_USER_ID } from "../utils/constants.js";

// Generate a Stripe PaymentIntent for the shopping cart total
export const createPaymentIntent = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;

    const cartItems = await cartService.getCart(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Shopping cart is empty" });
    }
    const { total } = calculateOrderTotals(cartItems);

    const intentDetails = await paymentService.createPaymentIntent(total);
    res.json(intentDetails);
  } catch (error) {
    next(error);
  }
};

// Expose the Stripe publishable key for client consumption
export const getPaymentConfig = async (req, res, next) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
    res.json({ publishableKey });
  } catch (error) {
    next(error);
  }
};

export default { createPaymentIntent, getPaymentConfig };

