import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const { amount = 29, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;
    const amountInPaise = Math.round(amount * 100);

    if (key_id && key_secret) {
      const razorpay = new Razorpay({ key_id, key_secret });
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes: { product: 'Exam Snap Premium Exam Pack' }
      });

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: key_id
      });
    }

    return res.status(200).json({
      success: true,
      sandbox: true,
      orderId: `order_dev_${Date.now()}`,
      amount: amountInPaise,
      currency,
      key: key_id || 'rzp_test_placeholder'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
