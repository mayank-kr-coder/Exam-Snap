import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Privacy Policy - 100% In-Browser Document Processing"
        description="Read how Sarkari Doc Prep (Exam Snap) handles your photographs and personal data with complete zero-cloud-upload privacy."
      />

      <div className="border-b border-gray-200 pb-5 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero Server Upload Guarantee</span>
        </div>
        <h1 className="text-3xl font-extrabold text-navy">Privacy Policy</h1>
        <p className="text-xs text-gray-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy">1. Local Client-Side Architecture</h2>
          <p>
            At <strong>Exam Snap (Sarkari Doc Prep)</strong>, we recognize that passport photographs, signatures, thumb impressions, and academic certificates are sensitive personal identifiers. All image resizing, cropping, paper whitening, date stamping, and PDF optimization are performed strictly in your local web browser utilizing the HTML5 Canvas API and WebAssembly.
          </p>
          <p className="font-semibold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            Your images and documents are never transmitted, copied, uploaded, or stored on any external server, database, or third-party cloud service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy">2. Information We Do NOT Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do NOT store your photographs, signatures, or thumb impressions.</li>
            <li>We do NOT retain candidate names or dates printed via our Date Stamp tool.</li>
            <li>We do NOT collect biometric facial recognition or fingerprint template datasets.</li>
            <li>We do NOT access your device camera or gallery without your direct user interaction.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy">3. LocalStorage & Cookies</h2>
          <p>
            We use your browser’s standard <code>localStorage</code> solely to remember non-sensitive user interface preferences (such as selected exam preset filters or admin authorization tokens). No personal images are ever stored in LocalStorage.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy">4. Payments & Razorpay Gateway</h2>
          <p>
            When purchasing the optional ₹29 Exam Pack pass, transaction processing is handled securely by Razorpay. ExamSnap does not collect or store credit card, debit card, or UPI banking credentials.
          </p>
        </section>
      </div>
    </div>
  );
};
