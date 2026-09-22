require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const resourceRoutes = require("./routes/resources");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/resources", resourceRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI || "mongodb://mongo:27017/portfolio")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
