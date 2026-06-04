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
    console.error(error.message);

    return null;
  }
};

module.exports = analyzeTextWithAI;