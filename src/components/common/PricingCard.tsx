import React from 'react';
import { Check, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { getPricingConfig } from '../../utils/storage';
import { Link } from 'react-router-dom';

export const PricingSection: React.FC = () => {
  const { isPremium, initiateRazorpayPayment, openPaymentModal } = usePayment();
  const pricing = getPricingConfig();

  return (
    <section className="py-12 sm:py-16 bg-brand-lightBg" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
            Simple & Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-3">
            Free for Everyone. Supercharged for Exam Day.
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Resize individual photos and signatures for free forever, or unlock the all-in-one Batch Exam Dossier pack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Forever Plan */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-brand-dark">Free Plan</h3>
                <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                  Standard Access
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-navy">₹0</span>
                <span className="text-xs text-gray-500 font-medium">/ forever</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Perfect for quick individual document edits when submitting a single application.
              </p>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Basic passport photograph resizing (px, cm, mm)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Signature resizing and paper cleaning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Individual iterative file compression (20KB - 50KB)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Standard instant JPG downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Client-side privacy on your device</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                to="/tools"
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-navy bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                Use Free Tools
              </Link>
            </div>
          </div>

          {/* Premium Exam Pack Plan */}
          <div className="bg-white rounded-2xl border-2 border-navy p-6 sm:p-8 flex flex-col justify-between shadow-elevated relative overflow-hidden">
            {/* Saffron corner ribbon */}
            <div className="absolute top-0 right-0 bg-saffron text-navy-900 text-[10px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              {pricing.badgeText || 'Most Popular'}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-saffron" />
                  <h3 className="text-lg font-bold text-navy">Premium Exam Pack</h3>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-extrabold text-navy">₹{pricing.packPrice}</span>
                <span className="text-xs text-gray-500 font-medium">one-time digital pass</span>
                <span className="text-xs text-gray-400 line-through">₹99</span>
              </div>
              <p className="text-xs text-gray-600 mb-6">
                Prepare all documents together in 1 click for any government exam.
              </p>

              <ul className="space-y-3 text-xs text-gray-800">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span><strong>Batch Processing:</strong> Photo + Signature + Thumb in 1 click</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>All-in-One Exam Dossier ZIP download</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Certificate PDF compression engine (&lt; 200KB)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Automatic Name & Date Stamp formatter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Ad-free distraction-free workspace</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Priority high-res canvas rendering</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
              {isPremium ? (
                <Link
                  to="/batch-dossier"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  Open Batch Dossier Studio →
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => initiateRazorpayPayment()}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-navy hover:bg-navy-800 transition flex items-center justify-center gap-2 shadow-elevated active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-saffron" />
                  <span>Unlock Exam Pack – ₹{pricing.packPrice}</span>
                </button>
              )}
              <p className="text-[10px] text-gray-500 text-center leading-tight">
                Secure checkout via Razorpay • 100% Money-back guarantee if document is rejected due to formatting specs
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory statutory disclaimer as requested */}
        <div className="mt-8 max-w-3xl mx-auto p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-center text-[11px] text-amber-900 leading-relaxed">
          <strong>Important Clarification:</strong> Payments are strictly for digital image formatting and batch processing utilities. ExamSnap / Sarkari Doc Prep is NOT a government agency and does NOT submit exam application forms on your behalf.
        </div>
      </div>
    </section>
  );
};
