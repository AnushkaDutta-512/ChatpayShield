const Transaction = require("../models/Transaction");

const analyzeTransactionRisk = require("../services/riskAnalysisService");

const createTransaction = async (req, res) => {
  try {
    const { amount, receiverUpiId, note } = req.body;

    // AI Risk Analysis
    const riskAnalysis = analyzeTransactionRisk({
      amount,
      receiverUpiId,
      note,
    });

    // Save transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      receiverUpiId,
      note,
      riskScore: riskAnalysis.riskScore,
      riskLevel: riskAnalysis.riskLevel,
      riskReasons: riskAnalysis.riskReasons,
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

module.exports = {
  createTransaction,
};