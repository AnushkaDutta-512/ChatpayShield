const Transaction = require("../models/Transaction");

const analyzeTransactionRisk = require("../services/riskAnalysisService");
const analyzeTextWithAI =
  require("../services/pythonAiService");
const analyzeBehavior = require("../services/behaviorAnalysisService");

const createTransaction = async (req, res) => {
  try {
    const { amount, receiverUpiId, note } = req.body;

    // AI risk analysis
    const riskAnalysis = analyzeTransactionRisk({
      amount,
      receiverUpiId,
      note,
    });

    // Behavioral anomaly analysis
    const behaviorAnalysis = await analyzeBehavior(
  req.user.id,
  {
    amount,
    receiverUpiId,
  }
);

const aiAnalysis = await analyzeTextWithAI(note);

    // Combined intelligence score
    const finalRiskScore = Math.round(
  riskAnalysis.riskScore * 0.4 +
  behaviorAnalysis.anomalyScore * 0.3 +
  aiAnalysis.fraud_score * 0.3
);
let riskLevel = "LOW";

if (finalRiskScore >= 80) {
  riskLevel = "CRITICAL";
} else if (finalRiskScore >= 60) {
  riskLevel = "HIGH";
} else if (finalRiskScore >= 30) {
  riskLevel = "MEDIUM";
}
const confidence = Math.min(
  100,
  Math.round(
    (
      riskAnalysis.riskReasons.length * 15 +
      behaviorAnalysis.anomalyReasons.length * 20 +
      aiAnalysis.reasons.length * 10
    )
  )
);
    // Save transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      receiverUpiId,
      note,
      confidence,

      riskScore: riskAnalysis.riskScore,
      riskLevel,
      riskReasons: riskAnalysis.riskReasons,

      anomalyScore: behaviorAnalysis.anomalyScore,
      anomalyReasons: behaviorAnalysis.anomalyReasons,
      
fraudScore: aiAnalysis.fraud_score,
fraudReasons: aiAnalysis.reasons,
      finalRiskScore,
    });

    res.status(201).json({
      success: true,
      message: "Transaction analyzed successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactionHistory,
};