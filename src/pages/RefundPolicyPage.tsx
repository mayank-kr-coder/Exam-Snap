import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { CheckCircle2 } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <SEOHead
        title="Refund Policy - 100% Satisfaction Guarantee"
        description="Exam Snap refund policy for digital Exam Pack purchases."
      />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-navy">Refund Policy</h1>
        <p className="text-xs text-gray-500 mt-1">Hassle-Free Money Back Guarantee</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-xs">
            100% Refund if an examination portal rejects your document due to formatting specification errors from our verified presets.
          </span>
        </div>

        <h2 className="text-base font-bold text-navy">1. Digital Exam Pack Refund Terms</h2>
        <p>
          We want every aspirant to have complete peace of mind. If you encounter any technical glitch with our Batch Dossier tool or if your formatted photo fails upload criteria on a government portal, contact our support team within 7 days of purchase.
        </p>

        <h2 className="text-base font-bold text-navy">2. How to Request a Refund</h2>
        <p>
          Simply email your payment reference ID and a screenshot of the portal rejection notice to <code>support@examsnap.in</code>. Refunds are processed back to the original payment source (UPI/Card/NetBanking) within 3-5 business days.
        </p>
      </div>
    </div>
  );
};
