const Transaction = require("../models/Transaction");

const analyzeBehavior = async (userId, currentTransaction) => {
  const previousTransactions = await Transaction.find({
    user: userId,
  });

  let anomalyScore = 0;

  const anomalyReasons = [];

  // No history yet
  if (previousTransactions.length === 0) {
    return {
      anomalyScore: 0,
      anomalyReasons: [],
    };
  }

  // Average amount calculation
  const totalAmount = previousTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const averageAmount =
    totalAmount / previousTransactions.length;

  // Detect unusual amount spike
  if (currentTransaction.amount > averageAmount * 3) {
    anomalyScore += 40;

    anomalyReasons.push(
      "Transaction amount significantly higher than usual behavior"
    );
  }

  // Late-night transaction detection
  const currentHour = new Date().getHours();

  if (currentHour >= 1 && currentHour <= 5) {
    anomalyScore += 25;

    anomalyReasons.push(
      "Late-night transaction detected"
    );
  }

  // Repeated risky receiver
  const suspiciousReceiverCount =
    previousTransactions.filter((transaction) =>
      transaction.receiverUpiId ===
      currentTransaction.receiverUpiId
    ).length;

  if (suspiciousReceiverCount >= 3) {
    anomalyScore += 20;

    anomalyReasons.push(
      "Repeated transactions to same receiver"
    );
  }

  return {
    anomalyScore,
    anomalyReasons,
  };
};

module.exports = analyzeBehavior;