const ORDERS_KEY = "amazon_orders";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getActiveUserId = () => {
  try {
    const saved = localStorage.getItem("amazon_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.id) return parsed.id;
    }
  } catch {}
  return "user-001"; // Fallback to default user Happy Lakhotia
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-user-id": getActiveUserId(),
});

/**
 * Format flat database order record to the nested format expected by React components
 */
const formatDbOrder = (order) => {
  if (!order) return null;
  return {
    id: order.id,
    placedAt: order.placedAt || order.placedAt,
    estimatedDelivery: order.estimatedDelivery,
    status: order.status || "Order Placed",
    items: order.items || [],
    address: {
      firstName: order.firstName,
      lastName: order.lastName,
      address: order.address,
      apartment: order.apartment || "",
      city: order.city,
      state: order.state,
      zipCode: order.zipCode,
      phone: order.phone,
    },
    totals: {
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
    },
  };
};

/**
 * Place a new order on the backend database
 */
export const placeOrder = async ({ address, cartItems, totals }) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to place order via API");
    }

    const dbOrder = await response.json();
    const formatted = formatDbOrder(dbOrder);

    // Save to localStorage as secondary backup
    try {
      const offlineOrders = getOfflineOrders();
      offlineOrders.unshift(formatted);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(offlineOrders));
    } catch (e) {
      console.warn("Offline cache save failed:", e.message);
    }

    return formatted;
  } catch (error) {
    console.warn("⚠️ API Order placement failed. Falling back to offline client-side placement. Error:", error.message);
    const localOrder = createOrder({ cartItems, address, totals });
    saveOrder(localOrder);
    return localOrder;
  }
};

/**
 * Load all orders from the database
 */
export const loadOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error("API orders fetch failed");
    const dbOrders = await response.json();
    return dbOrders.map(formatDbOrder);
  } catch (error) {
    console.warn("⚠️ Orders DB API failed, falling back to local storage cache. Error:", error.message);
    return getOfflineOrders();
  }
};

/**
 * Helper to fetch offline backup orders
 */
const getOfflineOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Compatibility exports to prevent build breakage during refactor
 */
export const saveOrder = (order) => {
  try {
    const orders = getOfflineOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return order;
  } catch (err) {
    console.error("Failed to save order offline fallback", err);
  }
};

export const createOrder = ({ cartItems, address, totals }) => {
  // Mock function for static compatibility if called
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  return {
    id: `114-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    items: cartItems,
    address,
    totals,
    status: "Order Placed",
    placedAt: new Date().toISOString(),
    estimatedDelivery: estimatedDelivery.toISOString(),
  };
};
