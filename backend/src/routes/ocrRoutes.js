const express = require("express");

const upload = require("../config/multerConfig");

const protect = require("../middleware/authMiddleware");

const {
  analyzeScreenshot,
} = require("../controllers/ocrController");

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("image"),
  analyzeScreenshot
);

module.exports = router;
