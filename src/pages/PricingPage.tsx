import React from 'react';
import { PricingSection } from '../components/common/PricingCard';
import { SEOHead } from '../components/common/SEOHead';

export const PricingPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Pricing & Plans - Free Forever vs ₹29 Exam Pack"
        description="ExamSnap pricing details: Free individual tools forever or ₹29 one-time Exam Pack for 1-click batch document dossier processing and PDF compression."
      />
      <div className="pt-6">
        <PricingSection />
      </div>
    </div>
  );
};
