import { Router } from "express";
import { getCart, addToCart, updateQuantity, removeFromCart, clearCart } from "../controllers/cartController.js";

const router = Router();

router.route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateQuantity)
  .delete(clearCart);

router.delete("/:productId", removeFromCart);

export default router;
