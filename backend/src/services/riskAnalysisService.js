const analyzeTransactionRisk = (transaction) => {
  let riskScore = 0;

  const riskReasons = [];

  // High amount detection
  if (transaction.amount > 10000) {
    riskScore += 40;

    riskReasons.push("High transaction amount");
  }

  // Suspicious UPI keywords
  const suspiciousKeywords = [
    "urgent",
    "lottery",
    "reward",
    "claim",
    "prize",
    "otp",
  ];

  const note = transaction.note.toLowerCase();

  suspiciousKeywords.forEach((keyword) => {
    if (note.includes(keyword)) {
      riskScore += 10;

      riskReasons.push(`Suspicious keyword detected: ${keyword}`);
    }
  });

  // Suspicious receiver pattern
  if (
    transaction.receiverUpiId.includes("random") ||
    transaction.receiverUpiId.includes("unknown")
  ) {
    riskScore += 25;

    riskReasons.push("Suspicious receiver UPI ID");
  }

  // Determine risk level
  let riskLevel = "LOW";

  if (riskScore >= 70) {
    riskLevel = "HIGH";
  } else if (riskScore >= 40) {
    riskLevel = "MEDIUM";
  }

  return {
    riskScore,
    riskLevel,
    riskReasons,
  };
};

module.exports = analyzeTransactionRisk;