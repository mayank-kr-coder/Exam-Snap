import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  PenTool, 
  Minimize2, 
  FileMinus, 
  Paintbrush, 
  Calendar, 
  Fingerprint, 
  FileText, 
  RefreshCw, 
  Crop,
  Shield, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Clock, 
  Lock, 
  Smartphone, 
  HelpCircle,
  Upload,
  Check,
  ChevronDown
} from 'lucide-react';
import { ToolCard } from '../components/common/ToolCard';
import { PricingSection } from '../components/common/PricingCard';
import { SEOHead } from '../components/common/SEOHead';
import { useExamPresets } from '../context/ExamPresetContext';
import { ToolInfo } from '../types/tool';

export const TOOLS_LIST: ToolInfo[] = [
  {
    id: 'passport-photo-resizer',
    title: 'Passport Photo Resizer',
    tagline: '3.5 x 4.5 cm / 20KB - 50KB',
    shortDesc: 'Resize photos to exact cm, mm, and pixel dimensions with configurable DPI and face oval alignment.',
    category: 'photo',
    icon: 'Camera',
    route: '/tools/passport-photo-resizer',
    badge: 'Most Used',
    popular: true
  },
  {
    id: 'signature-resizer',
    title: 'Signature Resizer',
    tagline: '10KB - 20KB / 140x60px',
    shortDesc: 'Crop signatures, whiten grey paper backgrounds, deepen pen ink strokes, and fit into portal limits.',
    category: 'signature',
    icon: 'PenTool',
    route: '/tools/signature-resizer',
    badge: 'Essential',
    popular: true
  },
  {
    id: 'photo-compressor',
    title: 'Photo Compressor',
    tagline: 'Compress below 50KB or 20KB',
    shortDesc: 'Iterative JPEG binary search compression that guarantees the file fits without blurring facial details.',
    category: 'photo',
    icon: 'Minimize2',
    route: '/tools/photo-compressor',
    popular: true
  },
  {
    id: 'signature-compressor',
    title: 'Signature Compressor',
    tagline: 'Compress below 20KB or 10KB',
    shortDesc: 'Shrink signature file size while maintaining razor-sharp handwriting edges for portal verification.',
    category: 'signature',
    icon: 'FileMinus',
    route: '/tools/signature-resizer',
  },
  {
    id: 'background-changer',
    title: 'Background Changer',
    tagline: 'Plain White & Light Studio Tones',
    shortDesc: 'Clean up off-white backgrounds to solid white or light studio grey in browser with zero server uploads.',
    category: 'photo',
    icon: 'Paintbrush',
    route: '/tools/background-changer',
    badge: 'New'
  },
  {
    id: 'date-stamp-tool',
    title: 'Date Stamp Tool',
    tagline: 'Name & Date of Photo (DOP)',
    shortDesc: 'Print candidate name and photograph date on a crisp white bottom banner as required by SSC & State PSCs.',
    category: 'photo',
    icon: 'Calendar',
    route: '/tools/date-stamp-tool',
  },
  {
    id: 'thumb-impression-resizer',
    title: 'Thumb Impression Resizer',
    tagline: 'Left Thumb Impression (LTI)',
    shortDesc: 'Crop, contrast ink ridges, whiten paper background, and compress for Banking (IBPS/SBI) and Railway exams.',
    category: 'signature',
    icon: 'Fingerprint',
    route: '/tools/thumb-impression-resizer',
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor',
    tagline: 'Certificates under 200KB',
    shortDesc: 'Optimize educational marksheets, caste and EWS certificates using browser-side pdf-lib stream compression.',
    category: 'document',
    icon: 'FileText',
    route: '/tools/pdf-compressor',
    badge: 'High Impact'
  },
  {
    id: 'image-to-jpg',
    title: 'Image to JPG',
    tagline: 'PNG / WebP to Standard JPEG',
    shortDesc: 'Convert mobile screenshots, WebP and transparent PNGs to portal-compliant JPEG format.',
    category: 'photo',
    icon: 'RefreshCw',
    route: '/tools/image-to-jpg',
  },
  {
    id: 'photo-cropper',
    title: 'Photo Cropper',
    tagline: 'Aspect Ratio & Frame Aligner',
    shortDesc: 'Crop images with 1:1, 3.5:4.5, 4:2 or freeform touch grid controls and instant download.',
    category: 'photo',
    icon: 'Crop',
    route: '/tools/photo-cropper',
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { presets, selectPresetById } = useExamPresets();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const examCategories = [
    {
      id: 'ssc',
      name: 'SSC Exams',
      exams: 'CGL, CHSL, MTS, CPO, GD Constable',
      presetId: 'ssc-cgl-chsl',
      badge: '3.5×4.5 cm | 20-50 KB'
    },
    {
      id: 'upsc',
      name: 'UPSC Exams',
      exams: 'Civil Services (CSE), NDA, CDS, CMS',
      presetId: 'upsc-civil-services',
      badge: '350×350 px | Name & Date'
    },
    {
      id: 'railway',
      name: 'Railway Exams',
      exams: 'RRB NTPC, Group D, ALP, Technicians',
      presetId: 'railway-rrb',
      badge: '35×45 mm | White BG'
    },
    {
      id: 'banking',
      name: 'Banking Exams',
      exams: 'IBPS PO, Clerk, SBI PO, RBI Grade B',
      presetId: 'banking-ibps-sbi',
      badge: 'Photo, Sign & LTI Thumb'
    },
    {
      id: 'state',
      name: 'State Govt Exams',
      exams: 'UPSSSC, BPSC, MPSC, Rajasthan, TNPSC',
      presetId: 'state-upsssc-bpsc',
      badge: 'State PSC Notices'
    },
    {
      id: 'university',
      name: 'University Admissions',
      exams: 'NTA NEET-UG, JEE-Main, CUET-UG',
      presetId: 'university-nta-cuet-neet',
      badge: 'Postcard & 80% Face'
    }
  ];

  const faqs = [
    {
      q: 'Is Sarkari Doc Prep free to use?',
      a: 'Yes! All features—including passport photo resizing, signature paper whitening, compression, PDF optimization, and the 1-click Batch Dossier Studio—are 100% free with unlimited downloads. There are no fees or subscriptions.'
    },
    {
      q: 'Are my photographs or signatures uploaded to a server?',
      a: 'Never. All document processing takes place directly in your web browser using HTML5 Canvas and WebAssembly. Your photographs and signatures never leave your phone or computer, ensuring 100% data privacy.'
    },
    {
      q: 'Can I resize my SSC photograph to 3.5 × 4.5 cm and 20KB–50KB?',
      a: 'Yes! The Passport Photo Resizer contains the official SSC preset that automatically locks dimensions to 3.5×4.5 cm (at 300 DPI) and executes iterative binary search compression so your file lands strictly inside the 20KB to 50KB limit.'
    },
    {
      q: 'Can I compress signatures below 20KB without making them unreadable?',
      a: 'Yes. Our signature engine brightens background paper, enhances pen ink contrast, and compresses to between 10KB and 20KB, ensuring your signature remains crisp and clear without rejection by examination scrutiny boards.'
    },
    {
      q: 'Does this work on mobile phones (Android & iPhone)?',
      a: 'Absolutely. ExamSnap is designed mobile-first. You can snap a photo directly using your smartphone camera or choose from your gallery, drag the crop frame with your finger, and download the ready JPG.'
    },
    {
      q: 'Can I prepare multiple documents (Photo + Signature + Thumb) together?',
      a: 'Yes! The Batch Dossier Studio allows you to upload your Photo, Signature, and Thumbprint simultaneously and download all three formatted documents in 1 click or as a single ZIP file completely free.'
    }
  ];

  const handleSelectExam = (presetId: string) => {
    selectPresetById(presetId);
    navigate('/tools/passport-photo-resizer');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEOHead
        title="Exam Snap — Sarkari Doc Prep | Your Documents. Perfectly Exam-Ready."
        description="Resize, crop, compress and prepare your exam documents in seconds. SSC, UPSC, IBPS, Railways & Govt Exam document upload assistant. 100% Free, Private & In-Browser."
      />

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron/15 border border-saffron/30 text-saffron-dark text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Documents. Perfectly Exam-Ready.</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-[1.15]">
                Make Every Document <span className="text-secondary">Exam-Ready.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Prepare your passport photos, signatures and exam documents according to application requirements. Fast, accurate and private.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/tools/passport-photo-resizer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-navy hover:bg-navy-800 shadow-elevated flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <span>Start Preparing Documents</span>
                  <ArrowRight className="w-4 h-4 text-saffron" />
                </Link>

                <Link
                  to="/tools"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-navy bg-white hover:bg-gray-50 border border-gray-300 shadow-subtle flex items-center justify-center gap-2 transition"
                >
                  Explore All Tools
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>100% In-Browser Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                  <span>Official Exam Dimensions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-saffron-dark" />
                  <span>Mobile & Camera Friendly</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Document Hero Illustration Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-elevated max-w-md w-full relative">
                {/* Decorative floating badge */}
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-card flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Portal Verified
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">
                      Instant Document Formatter
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">DPI: 300</span>
                  </div>

                  {/* Document preview simulation */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Simulated Photo */}
                    <div className="border border-gray-200 rounded-xl p-3 bg-brand-lightBg text-center space-y-2">
                      <div className="w-full h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 relative overflow-hidden">
                        <Camera className="w-7 h-7 text-gray-400" />
                        <span className="text-[10px] text-gray-500 mt-1">3.5 × 4.5 cm</span>
                        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-300 py-0.5 text-[8px] font-bold font-mono">
                          MAYANK • DOP: 2026
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                        38.4 KB (Pass)
                      </span>
                    </div>

                    {/* Simulated Signature */}
                    <div className="border border-gray-200 rounded-xl p-3 bg-brand-lightBg text-center space-y-2 flex flex-col justify-between">
                      <div className="w-full h-32 bg-white rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 p-2">
                        <PenTool className="w-6 h-6 text-brand-blue mb-1" />
                        <span className="font-serif italic text-sm text-navy font-bold">
                          Applicant Sign
                        </span>
                        <span className="text-[9px] text-gray-400 mt-1">4.0 × 2.0 cm</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                        14.2 KB (Pass)
                      </span>
                    </div>
                  </div>

                  {/* Action row */}
                  <button
                    type="button"
                    onClick={() => navigate('/tools/passport-photo-resizer')}
                    className="w-full py-3 bg-navy hover:bg-navy-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-saffron" />
                    <span>Drop Photo to Format Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tools Section (All 10 Tools) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
            Complete Tool Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-3">
            Genuinely Working Document Tools
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Every tool runs completely client-side in your browser with pixel precision and strict file size targeting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TOOLS_LIST.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-14 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-navy bg-gray-100 px-3 py-1 rounded-full">
              4-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-3">
              How Sarkari Doc Prep Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              From raw phone snapshot to official exam upload in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-brand-lightBg p-6 rounded-2xl border border-gray-100 space-y-3 relative">
              <span className="text-3xl font-black text-navy/15">01</span>
              <h3 className="font-bold text-base text-navy">Select Exam Requirements</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose SSC, UPSC, Railway, Banking, or custom dimensions to automatically load verified upload rules.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-brand-lightBg p-6 rounded-2xl border border-gray-100 space-y-3 relative">
              <span className="text-3xl font-black text-navy/15">02</span>
              <h3 className="font-bold text-base text-navy">Upload Photo or Document</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Take a photo directly with your camera or select from your gallery. Files stay 100% on your device.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-brand-lightBg p-6 rounded-2xl border border-gray-100 space-y-3 relative">
              <span className="text-3xl font-black text-navy/15">03</span>
              <h3 className="font-bold text-base text-navy">Auto Resize & Compress</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                The engine aligns aspect ratio, whitens paper, prints optional name/date stamps, and compresses to target KB.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-brand-lightBg p-6 rounded-2xl border border-gray-100 space-y-3 relative">
              <span className="text-3xl font-black text-navy/15">04</span>
              <h3 className="font-bold text-base text-navy">Preview & Download</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Inspect the final output quality and download your guaranteed portal-ready JPEG or optimized PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
              Exam Portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-2">
              Official Examination Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Click an exam category to immediately preload its verified specifications.
            </p>
          </div>

          <Link
            to="/presets"
            className="text-xs font-semibold text-secondary hover:text-navy flex items-center gap-1"
          >
            <span>View All Exam Presets</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {examCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectExam(cat.presetId)}
              className="group bg-white rounded-2xl border border-brand-border p-5 hover:border-navy hover:shadow-card transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-base text-navy group-hover:text-brand-blue transition">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {cat.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{cat.exams}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-navy">
                <span>Select Preset</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="faq">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-navy bg-gray-100 px-3 py-1 rounded-full">
            Help & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Common questions regarding government exam photo rules and offline privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-navy flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-navy' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
