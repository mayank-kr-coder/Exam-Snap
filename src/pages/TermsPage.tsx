import React from 'react';
import { SEOHead } from '../components/common/SEOHead';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <SEOHead
        title="Terms and Conditions - Sarkari Doc Prep"
        description="Terms and conditions for utilizing the Exam Snap document formatting utilities."
      />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-navy">Terms & Conditions</h1>
        <p className="text-xs text-gray-500 mt-1">Last Updated: February 2026</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h2 className="text-base font-bold text-navy">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Exam Snap (Sarkari Doc Prep), you agree to be bound by these Terms and Conditions. The platform provides automated browser-side utilities to assist candidates in preparing digital images according to general examination criteria.
        </p>

        <h2 className="text-base font-bold text-navy">2. User Responsibility</h2>
        <p>
          While Exam Snap strives to keep presets aligned with public government notices, examination commissions periodically revise upload guidelines. It is the sole responsibility of each candidate to verify specific dimensions, file formats, and date stamp rules in the official notification of their examination before final submission.
        </p>

        <h2 className="text-base font-bold text-navy">3. Intellectual Property</h2>
        <p>
          All trademarks, official logos, and examination names (e.g., SSC, UPSC, RRB, IBPS) referenced on this platform remain the intellectual property of their respective government authorities and testing bodies. Their mention on this platform is for descriptive reference only.
        </p>
      </div>
    </div>
  );
};
