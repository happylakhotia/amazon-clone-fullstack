/**
 * Generate a unique order ID in Amazon style (e.g. 114-1234567-1234567)
 * @returns {string} orderId
 */
export const generateOrderId = () => {
  const segment1 = Math.floor(100 + Math.random() * 900); // 3 digits, e.g. 114 or 402
  const segment2 = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  const segment3 = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  return `${segment1}-${segment2}-${segment3}`;
};
export default generateOrderId;
