// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Routes (all must default-export a router)
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import tenantRoutes from "./routes/tenants.js";
import rentRoutes from "./routes/rents.js";
import expenseRoutes from "./routes/expenses.js";
import depositRoutes from "./routes/deposits.js";
import propertyRoutes from "./routes/properties.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/rents", rentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/properties", propertyRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Rental App API is running...");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
