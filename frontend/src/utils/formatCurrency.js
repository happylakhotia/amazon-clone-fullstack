// Format a number as INR currency

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format a discount percentage

export const formatDiscount = (original, sale) => {
  if (!original || original <= sale) return null;
  const pct = Math.round(((original - sale) / original) * 100);
  return `${pct}% off`;
};
