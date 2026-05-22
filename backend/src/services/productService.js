import prisma from "../config/prisma.js";

//Fetch all products with optional search query and category filtering

export const getAllProducts = async ({ q = "", cat = "" }) => {
  const where = {};

  // Category filter
  if (cat && cat.trim().toLowerCase() !== "all") {
    where.category = {
      equals: cat,
      mode: "insensitive",
    };
  }
  // Text search query matching either title/name or description
  if (q && q.trim() !== "") {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

// Fetch a single product detail by ID
export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};
