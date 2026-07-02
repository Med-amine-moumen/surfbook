// ================================
// MAIN SERVER FILE
// This is where our Express server starts.
// It connects to MongoDB and sets up all routes.
// ================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Import all route files
import authRoutes from "./routes/auth";
import companyRoutes from "./routes/companies";
import roomRoutes from "./routes/rooms";
import packageRoutes from "./routes/packages";
import bookingRoutes from "./routes/bookings";
import customerRoutes from "./routes/customers";
import teamRoutes from "./routes/team";
import paymentRoutes from "./routes/payments";
import adminRoutes from "./routes/admin";
import subscriptionRoutes from "./routes/subscriptions";
import activityRoutes from "./routes/activities";
import sessionRoutes from "./routes/sessions";
import invoiceRoutes from "./routes/invoices";
import uploadRoutes from "./routes/upload";
import stripeRoutes, { stripeWebhookController } from "./routes/stripe";
import { apiLimiter } from "./middleware/rateLimiter";

// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Allow requests from our configured frontend URL(s)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Health check must be available before database-dependent routes.
// Railway uses this endpoint to decide whether the service started correctly.
app.get("/api/health", (_req, res) => {
  const dbStates: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    status: "ok",
    message: "Surf Booking API is running!",
    database: dbStates[mongoose.connection.readyState] || "unknown",
  });
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "SurfBook backend is running. Use /api/health for health checks.",
  });
});

// ================================
// STRIPE WEBHOOK
// Handle stripe webhook before express.json() parses the request body
// ================================
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

// Parse JSON request bodies
app.use(express.json());

// Apply global rate limiter to all /api routes
app.use("/api", apiLimiter);

app.use("/api/stripe", stripeRoutes);

// ================================
// ROUTES
// ================================

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/upload", uploadRoutes);

// Serve static files (like uploaded room images)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ================================
// DATABASE CONNECTION + SERVER START
// The server starts first so hosting health checks can pass.
// MongoDB connects in the background and API routes use it once connected.
// ================================

const PORT = Number(process.env.PORT) || 5005;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/surf-booking";

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed frontend origins: ${allowedOrigins.join(", ")}`);
});

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default app;
