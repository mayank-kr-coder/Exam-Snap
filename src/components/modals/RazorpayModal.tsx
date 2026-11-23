import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  CreditCard,
  Layers
} from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { getPricingConfig } from '../../utils/storage';

export const RazorpayModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    closePaymentModal, 
    unlockPremium, 
    paymentStatus, 
    paymentError,
    clearPaymentStatus
  } = usePayment();

  const pricing = getPricingConfig();
  const [testModeEnabled, setTestModeEnabled] = useState(false);

  if (!isPaymentModalOpen) return null;

  const hasEnvKey = Boolean((import.meta as any).env?.VITE_RAZORPAY_KEY_ID);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-navy text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-saffron" />
            </div>
            <div>
              <h3 className="font-bold text-base">Premium Exam Pack</h3>
              <p className="text-[11px] text-gray-300">Digital Document Processing Suite</p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Status: Failed */}
          {paymentStatus === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
              <h4 className="font-bold text-sm text-red-900">Payment Failed or Cancelled</h4>
              <p className="text-xs text-red-700">
                {paymentError || 'The transaction could not be completed by your banking provider.'}
              </p>
              <button
                onClick={clearPaymentStatus}
                className="mt-2 text-xs font-semibold text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Status: Success */}
          {paymentStatus === 'success' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base text-emerald-900">Exam Pack Unlocked!</h4>
              <p className="text-xs text-emerald-700">
                Batch processing, all-in-one dossier builder, and certificate PDF compression are now active.
              </p>
              <button
                onClick={closePaymentModal}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Go to Batch Dossier Studio
              </button>
            </div>
          )}

          {/* Integration Status / Environment Placeholder Notice */}
          {paymentStatus !== 'success' && (
            <>
              {/* Features summary */}
              <div className="bg-brand-lightBg p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-navy pb-2 border-b border-gray-200">
                  <span>Batch Dossier + PDF Compressor Pass</span>
                  <span className="text-sm font-mono">₹{pricing.packPrice}</span>
                </div>
                <ul className="space-y-1.5 text-gray-600 pt-1">
                  <li className="flex items-center gap-1.5">
                    <span className="text-saffron-dark font-bold">✓</span>
                    <span>1-Click Photo + Signature + Thumb bundle</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-saffron-dark font-bold">✓</span>
                    <span>High efficiency PDF certificate shrinker (&lt;200KB)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-saffron-dark font-bold">✓</span>
                    <span>Ad-free distraction-free interface</span>
                  </li>
                </ul>
              </div>

              {/* Secure Architecture Notice & Credentials Status */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-900">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[12px] text-amber-950">
                      Razorpay Payment Gateway Architecture
                    </h5>
                    <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                      Production integration generates orders server-side via Razorpay REST API and verifies <code>razorpay_signature</code> with HMAC-SHA256 to ensure zero secret key exposure in browser client.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-amber-800">
                    Client Key (<code>VITE_RAZORPAY_KEY_ID</code>):
                  </span>
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-white border border-amber-300">
                    {hasEnvKey ? 'Configured' : 'Not Set (Sandbox Placeholder)'}
                  </span>
                </div>
              </div>

              {/* Developer Test Mode Option */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-left">
                    <span className="text-xs font-semibold text-gray-800 block">
                      Demo / Reviewer Unlock
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Test batch document packaging features without payment
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      unlockPremium();
                      closePaymentModal();
                    }}
                    className="px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy-800 transition"
                  >
                    Unlock Demo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit SSL Encrypted • PCI-DSS Compliant Gateway</span>
        </div>
      </div>
    </div>
  );
};
