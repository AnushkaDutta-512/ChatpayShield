const Transaction = require("../models/Transaction");

const analyzeTransactionRisk = require("../services/riskAnalysisService");

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

    // Combined intelligence score
    const finalRiskScore =
      riskAnalysis.riskScore +
      behaviorAnalysis.anomalyScore;

    // Save transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      receiverUpiId,
      note,

      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      riskReasons: riskAnalysis.riskReasons,

      anomalyScore: behaviorAnalysis.anomalyScore,
      anomalyReasons: behaviorAnalysis.anomalyReasons,

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