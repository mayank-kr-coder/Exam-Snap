import React, { createContext, useContext, useState, useEffect } from 'react';
import { isPremiumUnlocked, setPremiumUnlocked, getPricingConfig } from '../utils/storage';
import { PaymentSuccessResponse } from '../types/payment';

interface PaymentContextType {
  isPremium: boolean;
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  unlockPremium: () => void;
  resetPremium: () => void;
  initiateRazorpayPayment: (options?: { onCompleted?: () => void }) => Promise<void>;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  paymentError: string | null;
  lastPaymentDetails: PaymentSuccessResponse | null;
  clearPaymentStatus: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Access client key from environment if provided
const RAZORPAY_KEY_ID = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || '';

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState<boolean>(() => isPremiumUnlocked());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [lastPaymentDetails, setLastPaymentDetails] = useState<PaymentSuccessResponse | null>(null);

  useEffect(() => {
    setIsPremium(isPremiumUnlocked());
  }, []);

  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    if (paymentStatus === 'failed') {
      setPaymentStatus('idle');
      setPaymentError(null);
    }
  };

  const unlockPremium = () => {
    setPremiumUnlocked(true);
    setIsPremium(true);
  };

  const resetPremium = () => {
    setPremiumUnlocked(false);
    setIsPremium(false);
  };

  const clearPaymentStatus = () => {
    setPaymentStatus('idle');
    setPaymentError(null);
  };

  const initiateRazorpayPayment = async (options?: { onCompleted?: () => void }) => {
    const pricing = getPricingConfig();
    const amountInPaise = pricing.packPrice * 100;

    setPaymentStatus('processing');
    setPaymentError(null);

    // Check if real Razorpay script & key exist
    if (typeof (window as any).Razorpay !== 'undefined' && RAZORPAY_KEY_ID) {
      try {
        const rzpOptions = {
          key: RAZORPAY_KEY_ID,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Exam Snap — Sarkari Doc Prep',
          description: 'Exam Pack — One-Time Digital Processing',
          image: '/favicon.ico',
          handler: function (response: PaymentSuccessResponse) {
            // Server-side verification placeholder check
            if (response.razorpay_payment_id) {
              setLastPaymentDetails(response);
              unlockPremium();
              setPaymentStatus('success');
              if (options?.onCompleted) options.onCompleted();
            } else {
              setPaymentStatus('failed');
              setPaymentError('Payment confirmation failed. Verification signature missing.');
            }
          },
          prefill: {
            name: 'Aspirant',
            email: 'aspirant@example.com',
            contact: '9999999999'
          },
          theme: {
            color: '#14213D'
          },
          modal: {
            ondismiss: function () {
              setPaymentStatus('idle');
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(rzpOptions);
        razorpayInstance.on('payment.failed', function (resp: any) {
          setPaymentStatus('failed');
          setPaymentError(resp.error?.description || 'Payment was declined or cancelled by the bank.');
        });
        razorpayInstance.open();
      } catch (err: any) {
        setPaymentStatus('failed');
        setPaymentError(err?.message || 'Failed to initialize Razorpay checkout.');
      }
    } else {
      // Credentials not configured in environment
      // Display clearly labelled integration state without simulating a fake monetary transaction
      setIsPaymentModalOpen(true);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        isPremium,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        unlockPremium,
        resetPremium,
        initiateRazorpayPayment,
        paymentStatus,
        paymentError,
        lastPaymentDetails,
        clearPaymentStatus
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
