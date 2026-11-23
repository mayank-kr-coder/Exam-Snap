import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { ChevronDown, HelpCircle, Shield, FileCheck2, Smartphone } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Is Sarkari Doc Prep (Exam Snap) free to use?',
      a: 'Yes, all individual document processing tools (passport photo resizer, signature resizer, photo compressor, date stamp tool, thumb impression resizer, image-to-jpg) are completely free with zero limits and instant downloads.'
    },
    {
      q: 'Are my photographs or signatures uploaded to a server?',
      a: 'No. All image operations are performed completely client-side in your web browser. Your private photos and signatures never leave your device, ensuring maximum privacy and data security.'
    },
    {
      q: 'Can I resize my SSC photograph to 3.5 × 4.5 cm and 20KB–50KB?',
      a: 'Yes. The SSC preset enforces 3.5×4.5 cm proportions and automatically runs iterative compression to ensure the resulting JPEG file is strictly within 20KB to 50KB, perfectly meeting SSC CGL, CHSL, MTS, and GD requirements.'
    },
    {
      q: 'Can I compress signatures below 20KB?',
      a: 'Yes. Our signature tool enhances ink stroke contrast, binarizes paper imperfections, and compresses the file to the strict 10KB–20KB range needed by SSC, IBPS, and state government portals.'
    },
    {
      q: 'Does this work on mobile phones?',
      a: 'Yes. ExamSnap is fully mobile-responsive. You can take a photo with your mobile camera or upload from your gallery, touch-drag the crop handles, and save the file directly to your phone storage.'
    },
    {
      q: 'Can I prepare multiple documents together?',
      a: 'Yes! With our Premium Exam Pack (₹29 one-time), you can access the Batch Dossier Studio, allowing you to upload your Photo, Signature, and Thumbprint at the same time and generate all three in 1 click.'
    },
    {
      q: 'Why do government portals reject photos with dark backgrounds?',
      a: 'Government exam verification systems (like SSC and UPSC facial recognition) require high contrast between the applicants face, ears, and the background. Dark or busy backgrounds confuse automated biometric verification.'
    },
    {
      q: 'What is the refund policy for the ₹29 Exam Pack?',
      a: 'We offer a 100% money-back guarantee if an exam portal rejects a document due to dimension or formatting failure caused by our preset specifications.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="FAQ - Frequently Asked Questions about Govt Exam Document Preparation"
        description="Got questions about photo dimensions, 20KB to 50KB size compression, date stamps, or privacy? Find all answers here."
      />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-navy">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Everything you need to know about exam document formatting, dimensions, and privacy.
        </p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-brand-border overflow-hidden transition shadow-subtle"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left font-bold text-sm text-navy flex items-center justify-between gap-4"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  openIdx === idx ? 'rotate-180 text-navy' : ''
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
