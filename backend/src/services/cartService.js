import prisma from "../config/prisma.js";

//Load cart items with their product details for a given user
export const getCart = async (userId) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  if (cartItems.length === 0) return [];

  // Manual fast join to fetch products details
  const productIds = cartItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  return cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      // Map product properties into cart item context
      name: product?.name,
      price: product?.price,
      originalPrice: product?.originalPrice,
      images: product?.images,
      stock: product?.stock,
      soldBy: product?.soldBy,
    };
  });
};

//Add a product to a user's cart
export const addToCart = async (userId, productId) => {
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId },
  });

  if (existing) {
    return await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  }

  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity: 1,
    },
  });
};

// Update the quantity of a cart item
export const updateQuantity = async (userId, productId, quantity) => {
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId },
  });

  if (!existing) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity: Math.max(1, quantity) },
  });
};

// Delete a product from the user's cart
export const removeFromCart = async (userId, productId) => {
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId },
  });

  if (!existing) {
    throw new Error("Cart item not found");
  }

  return await prisma.cartItem.delete({
    where: { id: existing.id },
  });
};

// Clear all cart items for a user
export const clearCart = async (userId) => {
  return await prisma.cartItem.deleteMany({
    where: { userId },
  });
};
