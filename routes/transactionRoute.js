const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');
const { auth } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');

// Plan mapping
const PLANS = {
  '100': { amount: 50, credits: 100 },
  '150': { amount: 70, credits: 150 },
  '210': { amount: 100, credits: 210 },
};

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const selected = PLANS[plan];
    if (!selected) return res.status(400).json({ success: false, message: 'Invalid plan' });
    const options = {
      amount: selected.amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order, credits: selected.credits });
  } catch (err) {
    console.error('Order creation failed:', err); // Explicit error logging
    res.status(500).json({ success: false, message: 'Order creation failed', error: err.message });
  }
});

// Verify Razorpay payment and credit user
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const selected = PLANS[plan];
    if (!selected) return res.status(400).json({ success: false, message: 'Invalid plan' });
    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    // Credit the user
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.creditBalance += selected.credits;
    await user.save();
    // Log the transaction
    await transactionModel.create({
      userId: req.user.id,
      plan: Number(plan),
      amount: selected.amount,
      credits: selected.credits,
      isActive: true,
    });
    res.json({ success: true, message: 'Payment verified and credits added', credits: user.creditBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment verification failed', error: err.message });
  }
});

module.exports = router; 