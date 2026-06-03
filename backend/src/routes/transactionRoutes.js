const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createTransaction,
  getTransactionHistory,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", protect, createTransaction);

router.get("/history", protect, getTransactionHistory);

module.exports = router;