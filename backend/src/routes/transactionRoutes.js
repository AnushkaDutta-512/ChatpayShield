const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/", protect, createTransaction);

module.exports = router;