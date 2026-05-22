import * as cartService from "../services/cartService.js";
import { DEFAULT_USER_ID } from "../utils/constants.js";

/*Fetch a user's active shopping cart items*/
export const getCart = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const cart = await cartService.getCart(userId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

/*Add a product to the cart*/
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const item = await cartService.addToCart(userId, productId);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

/*Update the quantity of a cart item*/
export const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }
    const item = await cartService.updateQuantity(userId, productId, quantity);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

/* Remove an item from the cart*/
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const { productId } = req.params;
    await cartService.removeFromCart(userId, productId);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};

/* Empty the shopping cart*/
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    await cartService.clearCart(userId);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};
