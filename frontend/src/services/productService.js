import products from "../data/products";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Fetch all products from Express API
 * Falls back to static data if database/backend is offline.
 */
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Fall back to local products if backend succeeds but DB is empty
    return [...products];
  } catch (error) {
    console.warn("⚠️ Backend product API unavailable, using static fallback. Error:", error.message);
    return [...products];
  }
};

/**
 * Fetch a single product detail from Express API
 */
export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Product not found via API: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`⚠️ Backend product API ID '${id}' failed, querying static data. Error:`, error.message);
    const product = products.find((p) => p.id === id);
    if (product) return product;
    throw new Error("Product not found");
  }
};

/**
 * Search products by name/description (Client-side helper)
 */
export const searchProducts = (query, productList = products) => {
  if (!query.trim()) return productList;
  const q = query.toLowerCase();
  return productList.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};

/**
 * Filter products by category (Client-side helper)
 */
export const filterByCategory = (category, productList = products) => {
  if (!category || category === "All") return productList;
  return productList.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Get related products (same category, excluding current)
 */
export const getRelatedProducts = (product, count = 4) => {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, count);
};

/**
 * Get products by badge (deals, best sellers etc.)
 */
export const getProductsByBadge = (badge, count = 8) => {
  return products
    .filter((p) => p.badge && p.badge.toLowerCase().includes(badge.toLowerCase()))
    .slice(0, count);
};
