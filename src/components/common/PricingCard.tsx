import React from 'react';
import { Check, Sparkles, Shield, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-brand-lightBg" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            100% Free Public Utility
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-3">
            Free for Every Student. No Fees, No Subscriptions.
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            ExamSnap is an open public utility built to empower students and aspirants across India. All tools, batch processing, and ZIP downloads are 100% free forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Tools */}
          <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-brand-dark">Individual Tools</h3>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  Always Free
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-navy">₹0</span>
                <span className="text-xs text-gray-500 font-medium">/ forever</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                Instant single-document editing for quick submissions.
              </p>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Passport Photo Resizer (3.5 × 4.5 cm / DPI converter)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Signature Resizer & Paper Shadow Whitener</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Iterative Photo Compressor (20 KB – 50 KB limits)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Name & Date of Photo (DOP) Stamp generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Client-Side Privacy: No uploads to servers</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                to="/tools"
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-navy bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                Explore All Tools
              </Link>
            </div>
          </div>

          {/* Batch Dossier & PDF Compressor Plan */}
          <div className="bg-white rounded-2xl border-2 border-navy p-6 sm:p-8 flex flex-col justify-between shadow-elevated relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-saffron text-navy-900 text-[10px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Free For Everyone
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-saffron" />
                  <h3 className="text-lg font-bold text-navy">Batch Exam Dossier Suite</h3>
                </div>
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-4xl font-extrabold text-navy">₹0</span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Free Public Access
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-6">
                Prepare all documents together in 1 click for any government exam.
              </p>

              <ul className="space-y-3 text-xs text-gray-800">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span><strong>1-Click Batch Processing:</strong> Photo + Signature + Thumb</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>All-in-One Exam Dossier ZIP download</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Certificate PDF compression engine (&lt; 200 KB)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Pre-configured official portal specs (SSC, UPSC, RRB)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Zero advertisements & zero sign-up friction</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-saffron-dark flex-shrink-0" />
                  <span>Works offline on mobile and desktop</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
              <Link
                to="/batch-dossier"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-navy hover:bg-navy-800 transition flex items-center justify-center gap-2 shadow-elevated"
              >
                <span>Open Batch Dossier Studio (Free)</span>
                <ArrowRight className="w-4 h-4 text-saffron" />
              </Link>
              <p className="text-[10px] text-gray-500 text-center leading-tight">
                No credit card, no phone number, no login required • Built with pride for Indian students
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 max-w-3xl mx-auto p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-center text-[11px] text-blue-950 leading-relaxed">
          <strong>Public Community Note:</strong> ExamSnap is completely free of charge. We do not charge any money, fees, or subscription for resizing, formatting, compressing, or preparing your documents.
        </div>
      </div>
    </section>
  );
};
