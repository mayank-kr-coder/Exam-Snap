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
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Smartphone, 
  Upload, 
  Check, 
  ChevronDown,
  Zap
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
    shortDesc: 'Resize photos to exact cm and pixel dimensions with face guide oval. Meets SSC, UPSC, and Railway guidelines.',
    category: 'photo',
    icon: 'Camera',
    route: '/tools/passport-photo-resizer',
    badge: 'Most Popular',
    popular: true
  },
  {
    id: 'signature-resizer',
    title: 'Signature Resizer',
    tagline: '10KB - 20KB / 140x60px',
    shortDesc: 'Whitens dark or grey paper backgrounds, sharpens pen ink, and fits into strict portal limits (10-20 KB).',
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
    shortDesc: 'Compress photos to fit portal boundaries without blurring your face or eyes.',
    category: 'photo',
    icon: 'Minimize2',
    route: '/tools/photo-compressor',
    popular: true
  },
  {
    id: 'date-stamp-tool',
    title: 'Date & Name Stamp Tool',
    tagline: 'Candidate Name & Photo Date (DOP)',
    shortDesc: 'Add printed candidate name and date of photo on a white bottom strip as required by SSC & UPSSSC.',
    category: 'photo',
    icon: 'Calendar',
    route: '/tools/date-stamp-tool',
  },
  {
    id: 'thumb-impression-resizer',
    title: 'Thumb Impression Resizer (LTI)',
    tagline: 'Left Thumb Impression / 10-20KB',
    shortDesc: 'Enhances ink ridges and paper whiteness for Banking (IBPS, SBI) and Railway exams.',
    category: 'signature',
    icon: 'Fingerprint',
    route: '/tools/thumb-impression-resizer',
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Certificate Compressor',
    tagline: 'Marksheet & Caste under 200KB',
    shortDesc: 'Shrink 10th marksheets and caste certificates below 200KB directly in your browser.',
    category: 'document',
    icon: 'FileText',
    route: '/tools/pdf-compressor',
    badge: 'High Impact'
  },
  {
    id: 'background-changer',
    title: 'Background Cleaner',
    tagline: 'Clean White Background',
    shortDesc: 'Clean off-white wall backgrounds to solid white in your browser without uploading your face to external servers.',
    category: 'photo',
    icon: 'Paintbrush',
    route: '/tools/background-changer',
  },
  {
    id: 'image-to-jpg',
    title: 'Image to JPG Converter',
    tagline: 'PNG / WebP to Standard JPEG',
    shortDesc: 'Convert phone screenshots, transparent PNGs, and WebPs to portal-compliant JPEG format.',
    category: 'photo',
    icon: 'RefreshCw',
    route: '/tools/image-to-jpg',
  },
  {
    id: 'photo-cropper',
    title: 'Photo Cropper',
    tagline: '1:1, 3.5:4.5, 4:2 & Freeform',
    shortDesc: 'Simple frame cropping with touch drag and instant export.',
    category: 'photo',
    icon: 'Crop',
    route: '/tools/photo-cropper',
  }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { presets, selectPresetById } = useExamPresets();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const popularExams = [
    {
      id: 'ssc',
      name: 'SSC (CGL, CHSL, MTS, GD)',
      specs: '3.5×4.5 cm • 20KB–50KB • White BG',
      presetId: 'ssc-cgl-chsl',
      tag: 'SSC'
    },
    {
      id: 'upsc',
      name: 'UPSC Civil Services / NDA',
      specs: '350×350 px • Name & Date on Photo',
      presetId: 'upsc-civil-services',
      tag: 'UPSC'
    },
    {
      id: 'railway',
      name: 'Railway (RRB NTPC, Group D)',
      specs: '35×45 mm • 20KB–50KB • Clean White BG',
      presetId: 'railway-rrb',
      tag: 'RRB'
    },
    {
      id: 'banking',
      name: 'Banking (IBPS, SBI PO, Clerk)',
      specs: 'Photo, Signature & Thumbprint (LTI)',
      presetId: 'banking-ibps-sbi',
      tag: 'BANK'
    }
  ];

  const faqs = [
    {
      q: 'Is ExamSnap completely free to use?',
      a: 'Yes, 100% free! All tools—including passport photo resizing, signature paper whitening, compression, PDF optimization, and the Batch Dossier Studio—are completely free with unlimited downloads. No sign-up, no payment, no credit card required.'
    },
    {
      q: 'Are my photographs or signatures uploaded to any server?',
      a: 'Never. All document processing takes place directly in your web browser on your phone or computer. Your photos and signatures never leave your device, ensuring complete privacy.'
    },
    {
      q: 'How do I resize my photo for SSC exams (3.5 × 4.5 cm / 20–50 KB)?',
      a: 'Simply click "Photo Resizer" at the top, select "SSC" from the exam dropdown, and upload your photo. The tool automatically sets dimensions to 3.5×4.5 cm and compresses the file between 20KB and 50KB.'
    },
    {
      q: 'How do I clean signature photos with grey/dark paper?',
      a: 'Open "Signature Resizer". Our smart paper-whitener automatically removes paper shadows, folds, and tints, deepening your pen ink strokes so the signature looks like a clean scan.'
    },
    {
      q: 'Does this work on mobile phones?',
      a: 'Yes! ExamSnap is built for mobile. You can snap a photo directly using your smartphone camera or choose from your gallery, drag the crop frame with your finger, and download the ready JPG.'
    },
    {
      q: 'Can I format Photo + Signature + Thumbprint together?',
      a: 'Yes! Use the "Batch Dossier" tool to format all three documents at once and download them together in a single ZIP file.'
    }
  ];

  const handleSelectExam = (presetId: string) => {
    selectPresetById(presetId);
    navigate('/tools/passport-photo-resizer');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <SEOHead
        title="ExamSnap — Sarkari Doc Prep | 100% Free Govt Exam Photo & Signature Resizer"
        description="Free online document preparation for SSC, UPSC, Railway, and Banking exams. Resize photos to 3.5x4.5 cm, whiten signature paper, compress to 20-50KB in seconds."
      />

      {/* Hero Section */}
      <section className="pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free • No Login Needed • Fast & Private</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            Make Your Documents <span className="text-secondary">Exam-Ready</span> in Seconds
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Resize passport photos, whiten signatures, compress files below 20KB–50KB, and add date stamps for Indian competitive exams.
          </p>

          {/* Direct Quick Action Buttons (What user wants to do) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <Link
              to="/tools/passport-photo-resizer"
              className="p-4 bg-white rounded-2xl border-2 border-navy hover:bg-navy hover:text-white transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-3">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy group-hover:text-white">Photo Resizer</h3>
                <span className="text-[11px] text-gray-500 group-hover:text-gray-200 block mt-0.5">3.5 × 4.5 cm • 20-50KB</span>
              </div>
            </Link>

            <Link
              to="/tools/signature-resizer"
              className="p-4 bg-white rounded-2xl border-2 border-navy hover:bg-navy hover:text-white transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-saffron-dark group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-3">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy group-hover:text-white">Signature</h3>
                <span className="text-[11px] text-gray-500 group-hover:text-gray-200 block mt-0.5">Clean White Paper • 10-20KB</span>
              </div>
            </Link>

            <Link
              to="/tools/photo-compressor"
              className="p-4 bg-white rounded-2xl border border-brand-border hover:border-navy hover:shadow-card transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Minimize2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy">Compressor</h3>
                <span className="text-[11px] text-gray-500 block mt-0.5">Shrink to 20KB or 50KB</span>
              </div>
            </Link>

            <Link
              to="/batch-dossier"
              className="p-4 bg-white rounded-2xl border border-brand-border hover:border-navy hover:shadow-card transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-saffron-dark" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy">All-in-One</h3>
                <span className="text-[11px] text-gray-500 block mt-0.5">Photo + Sign in 1-Click</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Exams Quick Select */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-navy flex items-center gap-2">
                <Zap className="w-4 h-4 text-saffron" />
                Select Your Exam for Automatic Formats
              </h2>
              <p className="text-xs text-gray-500">
                Click any exam below to automatically load its official photo and signature specifications.
              </p>
            </div>
            <Link to="/presets" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>View All Exams</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularExams.map((exam) => (
              <button
                key={exam.id}
                type="button"
                onClick={() => handleSelectExam(exam.presetId)}
                className="text-left p-3.5 rounded-2xl border border-gray-200 hover:border-navy hover:bg-navy/5 transition group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-navy group-hover:text-brand-blue">
                    {exam.tag}
                  </span>
                  <span className="text-[10px] text-gray-400 group-hover:text-navy">Format ➔</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 truncate">{exam.name}</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-tight">{exam.specs}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Easy 3-Step Guide */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-navy bg-gray-100 px-3 py-1 rounded-full">
            Simple 3 Steps
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy mt-2">
            How to Prepare Your Document
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center">
          <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-2 shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-navy text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-navy">Select Tool or Exam</h3>
            <p className="text-xs text-gray-500">
              Pick Photo Resizer, Signature, or choose SSC/UPSC preset.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-2 shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-navy text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-navy">Upload Photo / Snap Camera</h3>
            <p className="text-xs text-gray-500">
              Choose from phone gallery or test with sample photo in 1 click.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-brand-border space-y-2 shadow-subtle">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-navy">Download Exam-Ready JPG</h3>
            <p className="text-xs text-gray-500">
              Guaranteed to fit portal upload limits (20KB–50KB).
            </p>
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy">
            All Document Tools (100% Free)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Choose the specific tool you need for your exam application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS_LIST.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Free Public Notice */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="faq">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy">
            Common Questions
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Help with photo sizes, signature rules, and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden transition shadow-subtle"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-navy flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-navy' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
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
