const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  plan: { type: Number, required: true }, // Plan number (100, 150, 210)
  amount: { type: Number, required: true },
  credits: { type: Number, required: true },
  isActive: { type: Boolean, default: false }, // Status of transaction
});

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
