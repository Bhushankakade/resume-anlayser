import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/userModel.js';

// Initialize Razorpay Instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || key_id === 'your_razorpay_test_key_id' || !key_secret || key_secret === 'your_razorpay_test_key_secret') {
    throw new Error('Razorpay keys are not configured or are using placeholders in backend/.env');
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// @desc    Create a new Razorpay order for credits
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { amount, creditsToAdd } = req.body;
  
  if (!amount || !creditsToAdd) {
    res.status(400);
    throw new Error('Please provide amount and credits to add');
  }

  const razorpay = getRazorpayInstance();

  const options = {
    amount: amount * 100, // Amount in paise (multiply by 100 for INR)
    currency: 'INR',
    receipt: `receipt_order_${Math.floor(Math.random() * 10000)}_${Date.now()}`,
    notes: {
      userId: req.user._id.toString(),
      creditsToAdd: creditsToAdd.toString(),
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    
    if (!order) {
      res.status(500);
      throw new Error('Failed to create Razorpay order');
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500);
    throw new Error('Failed to initiate payment');
  }
});

// @desc    Verify payment and update user credits
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, creditsToAdd } = req.body;

  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_secret || key_secret === 'your_razorpay_test_key_secret') {
    res.status(500);
    throw new Error('Razorpay Key Secret is not configured. Please add it to your .env file.');
  }

  // Create signature based on Razorpay documentation
  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment is authentic, update user credits
    const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found during payment verification');
    }

    user.credits += parseInt(creditsToAdd);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and credits added',
      newCreditsTotal: user.credits
    });
  } else {
    // Signature did not match
    res.status(400);
    throw new Error('Payment verification failed! Invalid signature');
  }
});

export { createOrder, verifyPayment };
