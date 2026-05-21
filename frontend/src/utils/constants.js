export const CATEGORIES = [
  "All",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Toys",
];

export const TAX_RATE = 0.18; // 18% GST (India)
export const SHIPPING_COST = 40; // ₹40 below threshold
export const FREE_SHIPPING_THRESHOLD = 500; // Free shipping above ₹500

export const DEFAULT_USER = {
  id: "user-001",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null,
};

export const STAR_COLORS = {
  filled: "#FF9900",
  empty: "#DDD",
};

export const ROUTES = {
  HOME: "/",
  PRODUCT: "/product/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order-success",
  WISHLIST: "/wishlist",
  ORDERS: "/orders",
  NOT_FOUND: "*",
};

export const IMAGE_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="100%" height="100%" fill="%23f6f6f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="16" fill="%23999" font-weight="bold">Amazon Clone</text></svg>`;
