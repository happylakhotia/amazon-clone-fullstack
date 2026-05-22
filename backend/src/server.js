import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`AMAZON CLONE BACKEND IS NOW ONLINE!`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Node Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle termination signals gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down server gracefully...");
  server.close(() => {
    console.log("Server shutdown complete.");
  });
});
