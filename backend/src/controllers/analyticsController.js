const Transaction = require("../models/Transaction");

const getFraudAnalytics = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    });

    const totalTransactions = transactions.length;

    const highRiskTransactions =
      transactions.filter(
        (transaction) =>
          transaction.finalRiskScore >= 70
      ).length;

    const averageRiskScore =
      totalTransactions > 0
        ? (
            transactions.reduce(
              (sum, transaction) =>
                sum + transaction.finalRiskScore,
              0
            ) / totalTransactions
          ).toFixed(2)
        : 0;

    const suspiciousTransactions =
      transactions.filter(
        (transaction) =>
          transaction.riskLevel === "HIGH"
      );

    res.status(200).json({
      success: true,

      analytics: {
        totalTransactions,

        highRiskTransactions,

        averageRiskScore,

        suspiciousTransactionCount:
          suspiciousTransactions.length,

        suspiciousTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getFraudAnalytics,
};