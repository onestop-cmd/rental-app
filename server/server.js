import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import propertiesRoutes from "./routes/properties.js";
import dashboardRoutes from "./routes/dashboard.js";
import tenantsRoutes from "./routes/tenants.js";
import rentsRoutes from "./routes/rents.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Mount Routes (this is what "mount" means)
app.use("/api/properties", propertiesRoutes);   // CRUD for properties
app.use("/api/dashboard", dashboardRoutes);     // dashboard stats
app.use("/api/tenants", tenantsRoutes);         // tenant-related actions
app.use("/api/rents", rentsRoutes);             // rent-related actions

// =============================
// Serve React frontend in production
// =============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "dist");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, "index.html"));
  });
}

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
