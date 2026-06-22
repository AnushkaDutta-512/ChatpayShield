const axios = require("axios");

const analyzeTextWithAI = async (text) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze",
      {
        text,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Python AI Error:", error.message);

    return {
      fraud_score: 0,
      reasons: ["AI service unavailable"],
    };
  }
};

module.exports = analyzeTextWithAI;