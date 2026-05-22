import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "./constants";

//Calculate subtotal from cart items
export const calculateSubtotal = (items = []) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// Calculate tax amount
export const calculateTax = (subtotal) => {
  return subtotal * TAX_RATE;
};

//Calculate shipping cost (free if above threshold)
export const calculateShipping = (subtotal) => {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
};

//Calculate order total
export const calculateOrderTotals = (items = []) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;
  return { subtotal, tax, shipping, total };
};

// Get total item count in cart
export const getCartItemCount = (items = []) => {
  return items.reduce((acc, item) => acc + item.quantity, 0);
};
