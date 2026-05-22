import prisma from "../config/prisma.js";
import products from "../../../frontend/src/data/products.js";

/**
 * Seed product database with the items dataset from the frontend
 */
const seed = async () => {
  try {
    console.log("🚀 Starting database seeding...");

    // Seed default user (Happy Lakhotia)
    const defaultUser = await prisma.user.upsert({
      where: { id: "user-001" },
      update: {
        name: "Happy Lakhotia",
        email: "happy.lakhotia@example.in",
        phone: "9876543210",
        address: "Flat 101, A-Wing, Royal Residency",
        apartment: "Bandra West, Near Metro Station",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
      },
      create: {
        id: "user-001",
        name: "Happy Lakhotia",
        email: "happy.lakhotia@example.in",
        phone: "9876543210",
        address: "Flat 101, A-Wing, Royal Residency",
        apartment: "Bandra West, Near Metro Station",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
      },
    });
    console.log(`👤 Seeded/Verified default user: ${defaultUser.name}`);

    // Clear active products to allow complete re-seeding
    const deletedCount = await prisma.product.deleteMany({});
    console.log(`🧹 Cleared ${deletedCount.count} existing products.`);

    // Map and insert items
    let count = 0;
    for (const p of products) {
      await prisma.product.create({
        data: {
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          rating: p.rating,
          reviewCount: p.reviewCount,
          stock: p.stock,
          images: p.images, // Saved as native Postgres JSONb
          description: p.description,
          specifications: p.specifications, // Saved as native Postgres JSONb
          soldBy: p.soldBy,
          badge: p.badge || null,
        },
      });
      count++;
    }

    console.log(`✅ Success! Seeded ${count} products to the cloud database!`);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
