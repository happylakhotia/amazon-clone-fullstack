import prisma from "../config/prisma.js";
import { generateOrderId } from "../utils/generateOrderId.js";

//Map PostgreSQL nested OrderItem/Product schema to the flat JSON-friendly structure

const mapDbOrderToFrontend = (order) => {
  if (!order) return null;
  const { orderItems, ...rest } = order;
  return {
    ...rest,
    items: (orderItems || []).map((oi) => ({
      id: oi.id,
      productId: oi.productId,
      quantity: oi.quantity,
      price: oi.price,
      // Flatten joined product details for UI consumption
      name: oi.product?.name,
      images: oi.product?.images,
    })),
  };
};

//Place a new customer order (Normalized Relational implementation)

export const createOrder = async ({ userId, cartItems, address, totals }) => {
  const orderId = generateOrderId();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days delivery standard

  const order = await prisma.order.create({
    data: {
      id: orderId,
      userId,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || null,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      status: "Order Placed",
      estimatedDelivery,
      // Normalized nested creation
      orderItems: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return mapDbOrderToFrontend(order);
};

//Fetch a user's past orders sorted by date
export const getOrders = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { placedAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders.map(mapDbOrderToFrontend);
};

export default { createOrder, getOrders };
