const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    receiverUpiId: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    riskScore: {
      type: Number,
      default: 0,
    },
    anomalyScore: {
  type: Number,
  default: 0,
},

anomalyScore: {
  type: Number,
  default: 0,
},

anomalyReasons: [
  {
    type: String,
  },
],

fraudScore: {
  type: Number,
  default: 0,
},

fraudReasons: [
  {
    type: String,
  },
],

finalRiskScore: {
  type: Number,
  default: 0,
},
    riskLevel: {
      type: String,
      default: "LOW",
    },

    riskReasons: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);