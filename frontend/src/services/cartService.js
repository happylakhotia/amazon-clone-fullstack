const CART_KEY = "amazon_cart";
const WISHLIST_KEY = "amazon_wishlist";
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
 * Fetch cart items from Express DB API
 */
export const loadCart = async () => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("API Cart fetch failed");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Cart DB API fetch failed, falling back to localStorage. Error:", error.message);
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
};

/**
 * Persist cart items to localStorage as redundancy fallback
 */
export const saveCartOffline = (cartItems) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (err) {
    console.error("Failed to save cart offline", err);
  }
};

/**
 * DB API: Add item to backend database
 */
export const addToCart = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw new Error("Failed to add to database cart");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Add-to-cart API failed. Operation will proceed locally.", error.message);
    return null;
  }
};

/**
 * DB API: Update item quantity in database
 */
export const updateQuantity = async (productId, quantity) => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) throw new Error("Failed to update database cart quantity");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Update-quantity API failed. Operation will proceed locally.", error.message);
    return null;
  }
};

/**
 * DB API: Delete item from database
 */
export const removeFromCart = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to remove from database cart");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Remove-from-cart API failed. Operation will proceed locally.", error.message);
    return null;
  }
};

/**
 * DB API: Clear all items from database cart
 */
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to clear database cart");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Clear-cart API failed. Operation will proceed locally.", error.message);
    return null;
  }
};

/**
 * Wishlist handlers (remains client-only localStorage for lightweight operations)
 */
export const loadWishlist = () => {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save wishlist", err);
  }
};
