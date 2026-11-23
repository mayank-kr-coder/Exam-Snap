import React from 'react';
import { PricingSection } from '../components/common/PricingCard';
import { SEOHead } from '../components/common/SEOHead';

export const PricingPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="100% Free Public Utility - No Fees, No Subscriptions"
        description="ExamSnap is 100% free forever for all Indian government examination aspirants. Zero fees for passport photo resizing, signature cleaning, PDF compression, and batch dossiers."
      />
      <div className="pt-6">
        <PricingSection />
      </div>
    </div>
  );
};
