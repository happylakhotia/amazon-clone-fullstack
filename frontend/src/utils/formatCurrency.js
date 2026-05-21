/**
 * Format a number as INR currency
 * @param {number} amount
 * @returns {string} e.g. "₹1,29,999.00"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a discount percentage
 * @param {number} original
 * @param {number} sale
 * @returns {string} e.g. "(-20%)"
 */
export const formatDiscount = (original, sale) => {
  if (!original || original <= sale) return null;
  const pct = Math.round(((original - sale) / original) * 100);
  return `${pct}% off`;
};
