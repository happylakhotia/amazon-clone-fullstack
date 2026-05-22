import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "./constants.js";

/**
 * Calculate totals for order calculation
 * @param {Array} items - List of items with price and quantity
 * @returns {Object} totals - { subtotal, tax, shipping, total }
 */
export const calculateOrderTotals = (items) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  return { subtotal, tax, shipping, total };
};
export default calculateOrderTotals;
