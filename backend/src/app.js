import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Middlewares
import notFound from "./middleware/notFoundMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Configure Environment Variables
dotenv.config();

const app = express();

// Set up CORS with support for frontend dev ports and Vercel deployment
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
      ];
      // Allow all Vercel preview/production deployments and requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json());

// Logger Middleware (Optional but premium developer feedback)
app.use((req, res, next) => {
  console.log(`[API LOG] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes Mounting
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

// Base route for connectivity checks
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Amazon Clone Full-Stack Service is operational.",
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Handler
app.use(notFound);

// Global Exception Filter
app.use(errorHandler);

export default app;
