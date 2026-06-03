const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getFraudAnalytics,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", protect, getFraudAnalytics);

module.exports = router;