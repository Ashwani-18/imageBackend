const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true },
  creditBalance: { type: Number, default: 5 },
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel; 
