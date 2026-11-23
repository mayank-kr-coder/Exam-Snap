export interface PaymentPlan {
  id: string;
  name: string;
  price: number; // In INR, e.g. 29
  currency: string;
  period: string; // "one-time"
  description: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

export interface RazorpayOrderPayload {
  amount: number; // in paise (e.g. 2900)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
