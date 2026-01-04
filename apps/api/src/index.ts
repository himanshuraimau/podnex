import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { errorHandler, notFound } from "./middleware/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - MUST come before Better Auth handler
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth handler - MUST come before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

// Other middleware (after Better Auth)
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📝 Auth endpoint: http://localhost:${PORT}/api/auth`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
});
