const extractTextFromImage = require("../services/ocrService");

const analyzeTransactionRisk = require("../services/riskAnalysisService");

const analyzeScreenshot = async (req, res) => {
  try {
    const imagePath = req.file.path;

    // OCR extraction
    const extractedText = await extractTextFromImage(imagePath);

    // AI Risk Analysis
    const riskAnalysis = analyzeTransactionRisk({
      amount: 0,
      receiverUpiId: "unknown@upi",
      note: extractedText,
    });

    res.status(200).json({
      success: true,
      extractedText,
      riskAnalysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeScreenshot,
} ;