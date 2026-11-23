import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Razorpay instance if keys are available
const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;
if (key_id && key_secret) {
  razorpay = new Razorpay({
    key_id,
    key_secret
  });
  console.log('✓ Razorpay live gateway configured');
} else {
  console.log('! Razorpay keys not detected in environment. Running in sandbox development mode.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ExamSnap Backend API',
    razorpayConfigured: Boolean(razorpay),
    timestamp: new Date().toISOString()
  });
});

// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount = 29, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;
    const amountInPaise = Math.round(amount * 100);

    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes: {
          product: 'Exam Snap Premium Exam Pack',
          purpose: 'Digital Document Formatting Pass'
        }
      });
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id
      });
    }

    // Development sandbox response
    return res.json({
      success: true,
      sandbox: true,
      orderId: `order_dev_${Date.now()}`,
      amount: amountInPaise,
      currency,
      key: key_id || 'rzp_test_placeholder',
      message: 'Running in sandbox mode without server keys.'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment order.'
    });
  }
});

// Verify Payment Signature (HMAC-SHA256)
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment parameters' });
    }

    if (razorpay && key_secret) {
      const hmac = crypto.createHmac('sha256', key_secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature === razorpay_signature) {
        return res.json({
          success: true,
          verified: true,
          message: 'Payment signature verified successfully.'
        });
      } else {
        return res.status(400).json({
          success: false,
          verified: false,
          error: 'Invalid payment signature. Verification failed.'
        });
      }
    }

    // Sandbox verification
    return res.json({
      success: true,
      sandbox: true,
      verified: true,
      message: 'Verified in development sandbox mode.'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error verifying payment.'
    });
  }
});

// Serve frontend production build static files
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback all routes to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Exam Snap server listening on port ${PORT}`);
});
