const userModel = require("../models/userModel");

exports.credits = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await userModel.findById(userId).select("name creditBalance");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name }
    });
  } catch (error) {
    console.error("Credits Error:", error.message);
    res.status(500).json({
      message: "Unable to fetch credit balance",
      success: false
    });
  }
};
