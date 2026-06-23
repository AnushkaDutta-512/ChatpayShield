require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const app = express();
const analyticsRoutes = require("./routes/analyticsRoutes");


app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ChatPayShield API is running" ,
  });
});

module.exports = app;