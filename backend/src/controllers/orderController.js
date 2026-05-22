import * as orderService from "../services/orderService.js";
import * as cartService from "../services/cartService.js";
import * as userService from "../services/userService.js";
import * as emailService from "../services/emailService.js";
import { calculateOrderTotals } from "../utils/calculateTotal.js";
import { DEFAULT_USER_ID } from "../utils/constants.js";

//Fetch list of a user's past orders
export const getOrders = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const orders = await orderService.getOrders(userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

//Place a new order based on current cart items
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }
    const cartItems = await cartService.getCart(userId);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Shopping cart is empty" });
    }
    const totals = calculateOrderTotals(cartItems);

    // Save the order to DB
    const order = await orderService.createOrder({
      userId,
      cartItems,
      address,
      totals,
    });

    await cartService.clearCart(userId);

    userService.getUserById(userId)
      .then((user) => {
        if (user) {
          emailService.sendOrderConfirmationEmail({ order, user });
        }
      })
      .catch((err) => console.error("Failed to fetch user for email confirmation:", err.message));

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};
export default { getOrders, createOrder };
