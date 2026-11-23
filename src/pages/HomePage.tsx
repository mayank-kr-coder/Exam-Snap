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
  Zap,
  Printer,
  FileCheck2,
  Layers,
  Lock,
  ExternalLink,
  Award,
  Eye,
  Sliders
} from 'lucide-react';
import { ToolCard } from '../components/common/ToolCard';
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
    id: 'file-size-checker',
    title: 'Real-Time File Size Checker',
    tagline: 'Instant Portal Compliance Matrix',
    shortDesc: 'Verify if your photo or signature passes SSC, UPSC, IBPS and Railway upload limits in exact KB.',
    category: 'photo',
    icon: 'FileCheck2',
    route: '/tools/file-size-checker',
    badge: 'New & Fast',
    popular: true
  },
  {
    id: 'passport-photo-print-sheet',
    title: 'A4 Passport Photo Print Sheet',
    tagline: 'Tile 4 to 32 Photos with Cut Marks',
    shortDesc: 'Arrange passport photos on A4 or 4x6" paper at 300 DPI ready for studio printing with scissor guidelines.',
    category: 'photo',
    icon: 'Printer',
    route: '/tools/passport-photo-print-sheet',
    badge: 'High Quality',
    popular: true
  },
  {
    id: 'batch-processor',
    title: 'Batch Bulk Image Processor',
    tagline: 'Multiple Images to Single ZIP',
    shortDesc: 'Compress and format multiple documents, certificates, and photos simultaneously in your browser.',
    category: 'document',
    icon: 'Layers',
    route: '/tools/batch-processor',
    badge: 'Time Saver'
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
  const [selectedExamTab, setSelectedExamTab] = useState<'ssc' | 'upsc' | 'railway' | 'banking'>('ssc');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const examTabDetails = {
    ssc: {
      name: 'Staff Selection Commission (SSC)',
      exams: 'SSC CGL, CHSL, MTS, GD Constable, CPO, Stenographer',
      photoDims: '3.5 cm × 4.5 cm (413 × 531 px @ 300 DPI)',
      photoSize: '20 KB – 50 KB (JPEG / JPG)',
      photoBg: 'Plain white or light off-white background. Both ears must be clearly visible.',
      signatureDims: '4.0 cm × 2.0 cm (472 × 236 px)',
      signatureSize: '10 KB – 20 KB (JPEG / JPG)',
      signatureRule: 'Black or dark blue ink on white paper. Capital letter signatures strictly rejected.',
      verifiedDate: '10 Jan 2026',
      sourceUrl: 'https://ssc.gov.in/notices',
      sourceName: 'Official SSC Candidate Notice',
      presetId: 'ssc-cgl-chsl'
    },
    upsc: {
      name: 'Union Public Service Commission (UPSC)',
      exams: 'Civil Services (IAS/IPS/IFS), NDA, CDS, Engineering Services (IES)',
      photoDims: 'Min 350 × 350 px, Max 1000 × 1000 px (3:4 or 1:1)',
      photoSize: '20 KB – 300 KB (JPEG / JPG)',
      photoBg: 'White background. Must be recent (taken within 10 days of notification). Name and date required.',
      signatureDims: 'Min 350 × 350 px, Max 1000 × 1000 px',
      signatureSize: '20 KB – 300 KB (JPEG / JPG)',
      signatureRule: 'Clean signature in black ink on white paper, clearly legible.',
      verifiedDate: '01 Feb 2026',
      sourceUrl: 'https://upsc.gov.in/examinations',
      sourceName: 'UPSC CSE Official Notification',
      presetId: 'upsc-civil-services'
    },
    railway: {
      name: 'Railway Recruitment Boards (RRB)',
      exams: 'RRB Assistant Loco Pilot (ALP), Technician, NTPC, Group D',
      photoDims: '35 mm × 45 mm (413 × 531 px @ 300 DPI)',
      photoSize: '30 KB – 70 KB (JPEG / JPG)',
      photoBg: 'Solid white background. Frontal face view without sunglasses or caps.',
      signatureDims: '140 × 60 px or 4.0 × 2.0 cm',
      signatureSize: '30 KB – 70 KB (JPEG / JPG)',
      signatureRule: 'Running hand in black or blue ink. Overlapping or smudged signatures rejected.',
      verifiedDate: '20 Jan 2026',
      sourceUrl: 'https://indianrailways.gov.in',
      sourceName: 'RRB Centralized Employment Notice',
      presetId: 'rrb-railway-alp-ntpc'
    },
    banking: {
      name: 'Institute of Banking Personnel Selection (IBPS)',
      exams: 'IBPS PO, Clerk, SO, RRB Office Assistant & SBI PO/Clerk',
      photoDims: '4.5 cm × 3.5 cm (200 × 230 px)',
      photoSize: '20 KB – 50 KB (JPEG / JPG)',
      photoBg: 'Light colored or preferably white background. Eyes wide open and visible.',
      signatureDims: '140 × 60 px (Pixels strictly enforced)',
      signatureSize: '10 KB – 20 KB (JPEG / JPG)',
      signatureRule: 'Black ink only on white paper. Capital letters not accepted.',
      verifiedDate: '15 Jan 2026',
      sourceUrl: 'https://ibps.in',
      sourceName: 'IBPS CRP Official Guidelines',
      presetId: 'ibps-po-clerk-sbi'
    }
  };

  const currentExam = examTabDetails[selectedExamTab];

  const handleApplyPreset = (presetId: string, route: string = '/tools/passport-photo-resizer') => {
    selectPresetById(presetId);
    navigate(route);
  };

  const faqs = [
    {
      q: 'Is ExamSnap completely free to use?',
      a: 'Yes, 100% free! All tools—including passport photo resizing, signature paper whitening, compression, PDF optimization, A4 print sheets, and batch processing—are completely free with unlimited downloads. No sign-up, no hidden fees, no credit card required.'
    },
    {
      q: 'Are my photographs or signatures uploaded to any server?',
      a: 'Never. All document processing happens strictly inside your local web browser using the HTML5 Canvas API. Your photos and biometrics never leave your phone or computer, providing total privacy and zero risk of data leaks.'
    },
    {
      q: 'How do I resize my photo for SSC exams (3.5 × 4.5 cm / 20–50 KB)?',
      a: 'Click "Photo Resizer" at the top, select "SSC" from the exam preset selector, and upload your photo. The tool automatically applies 3.5×4.5 cm dimensions and iteratively compresses the file strictly between 20KB and 50KB in JPEG format.'
    },
    {
      q: 'How does the Signature Resizer clean grey or shadowy paper?',
      a: 'Our browser-side paper whitening algorithm analyzes the luminosity of the paper background, neutralizes yellow/grey tints and shadows, and enhances the contrast of the pen ink strokes to give a crisp, scanner-quality output.'
    },
    {
      q: 'How does the A4 Print Sheet generator work?',
      a: 'The A4 Print Sheet tool allows you to tile 4, 6, 8, 12, 16, or 32 passport photos onto an A4 or 4×6" photo paper sheet with scissor cut guidelines at 300 DPI. You can download the sheet as high-res JPG, PDF, or print directly using your printer.'
    },
    {
      q: 'What does the Photo Quality & Blur Checker do?',
      a: 'When you upload a photo, ExamSnap performs a real-time variance of the Laplacian filter check to assess sharpness, evaluates lighting/exposure levels, and checks resolution against official examination standards so you know your photo is clear before submitting.'
    },
    {
      q: 'Does ExamSnap work on mobile phones?',
      a: 'Yes! ExamSnap is built with a responsive, mobile-first design. You can snap a photo directly using your smartphone camera or choose from your gallery, drag the crop frame with your finger, and download the ready JPG in seconds.'
    }
  ];

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      <SEOHead
        title="ExamSnap — Sarkari Doc Prep | 100% Free Govt Exam Photo & Signature Resizer"
        description="Free online document preparation for SSC, UPSC, Railway, and Banking exams. Resize photos to 3.5x4.5 cm, whiten signature paper, compress to 20-50KB, tile on A4 sheets, and verify portal compliance in seconds."
      />

      {/* Hero Section */}
      <section className="pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-5">
          {/* Top Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-Side Privacy: Your documents never touch any server</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-tight">
            Make Every Document <br className="hidden sm:inline" />
            <span className="text-secondary underline decoration-saffron decoration-4 underline-offset-4">
              Exam-Ready
            </span> in Seconds.
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Resize passport photos to 3.5×4.5 cm, whiten signature backgrounds, add candidate DOP stamps, and compress files below 20KB–50KB. Free, private, and 100% in-browser.
          </p>

          {/* Quick Action Cards (Direct entry to top tools) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <Link
              to="/tools/passport-photo-resizer"
              className="p-4 bg-white rounded-2xl border-2 border-navy hover:bg-navy hover:text-white transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-3 transition">
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
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-saffron-dark group-hover:bg-white/20 group-hover:text-white flex items-center justify-center mb-3 transition">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy group-hover:text-white">Signature Resizer</h3>
                <span className="text-[11px] text-gray-500 group-hover:text-gray-200 block mt-0.5">Clean White Paper • 10-20KB</span>
              </div>
            </Link>

            <Link
              to="/tools/file-size-checker"
              className="p-4 bg-white rounded-2xl border border-brand-border hover:border-navy hover:shadow-card transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy">Size Checker</h3>
                <span className="text-[11px] text-gray-500 block mt-0.5">Check Portal Acceptance</span>
              </div>
            </Link>

            <Link
              to="/tools/passport-photo-print-sheet"
              className="p-4 bg-white rounded-2xl border border-brand-border hover:border-navy hover:shadow-card transition group shadow-subtle flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-navy">A4 Print Sheet</h3>
                <span className="text-[11px] text-gray-500 block mt-0.5">Tile 4 to 32 Photos</span>
              </div>
            </Link>
          </div>

          {/* Quick stats strip */}
          <div className="pt-6 flex items-center justify-center gap-6 sm:gap-10 text-xs text-gray-500 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-bold" />
              <span className="font-semibold text-gray-700">100% Free Public Utility</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-bold" />
              <span className="font-semibold text-gray-700">Zero Server Uploads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-bold" />
              <span className="font-semibold text-gray-700">No Sign-up / Login</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 font-bold" />
              <span className="font-semibold text-gray-700">Works on Android & iPhone</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Popular Tools Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-saffron-dark" />
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark">
                High Demand Utilities
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
              Popular Document Preparation Tools
            </h2>
          </div>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-secondary transition"
          >
            <span>View All 12 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS_LIST.slice(0, 4).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Exam-Wise Presets (SSC, UPSC, Railway, Banking) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-secondary" />
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Official Exam Formats
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
                Exam-Wise Document Specifications
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Verified specifications from official recruitment notices. Load specs directly into any tool with 1-click.
              </p>
            </div>

            {/* Exam category switcher tabs */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
              {(['ssc', 'upsc', 'railway', 'banking'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedExamTab(tab)}
                  className={`px-3 py-1.5 rounded-lg transition capitalize ${
                    selectedExamTab === tab
                      ? 'bg-navy text-white shadow-xs'
                      : 'text-gray-600 hover:text-navy hover:bg-gray-200/60'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Active Exam Card Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-saffron text-navy text-[11px] font-bold uppercase tracking-wide">
                    {selectedExamTab.toUpperCase()} Category
                  </span>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified: {currentExam.verifiedDate}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-navy">{currentExam.name}</h3>
                <p className="text-xs text-gray-500">{currentExam.exams}</p>
              </div>

              {/* Two Column Specs Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo Specs */}
                <div className="bg-brand-lightBg p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-brand-blue" />
                      Photograph Specs
                    </span>
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {currentExam.photoSize}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><strong>Dimensions:</strong> {currentExam.photoDims}</p>
                    <p className="text-[11px] text-gray-500"><strong>Background:</strong> {currentExam.photoBg}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(currentExam.presetId, '/tools/passport-photo-resizer')}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-navy hover:bg-navy-800 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>Format Photo for {selectedExamTab.toUpperCase()}</span>
                    <ArrowRight className="w-3 h-3 text-saffron" />
                  </button>
                </div>

                {/* Signature Specs */}
                <div className="bg-brand-lightBg p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-saffron-dark" />
                      Signature Specs
                    </span>
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {currentExam.signatureSize}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p><strong>Dimensions:</strong> {currentExam.signatureDims}</p>
                    <p className="text-[11px] text-gray-500"><strong>Guidelines:</strong> {currentExam.signatureRule}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(currentExam.presetId, '/tools/signature-resizer')}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-white hover:bg-gray-50 border border-navy text-navy text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <span>Format Signature for {selectedExamTab.toUpperCase()}</span>
                    <ArrowRight className="w-3 h-3 text-navy" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side notification & source verification */}
            <div className="lg:col-span-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 text-xs">
              <span className="font-bold text-navy uppercase tracking-wider text-[11px] block">
                Verification Details
              </span>

              <div className="space-y-1.5 text-gray-600">
                <p>
                  <strong>Official Source:</strong>{' '}
                  <span className="text-gray-800">{currentExam.sourceName}</span>
                </p>
                <p>
                  <strong>Last Audit:</strong>{' '}
                  <span className="text-gray-800">{currentExam.verifiedDate}</span>
                </p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Specifications are mapped against current advertisement notifications. Always check your specific exam notification for post-specific requirements.
                </p>
              </div>

              <a
                href={currentExam.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-secondary hover:underline pt-1"
              >
                <span>View Official Notice Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="pt-2 border-t border-gray-200">
                <Link
                  to="/presets"
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-300 text-navy font-bold text-xs transition flex items-center justify-center gap-1"
                >
                  <span>Explore All Exam Presets</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: All Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
            Complete Suite of Government Document Tools
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Every utility you need to format photos, signatures, thumb impressions, and marksheets for government exam portals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS_LIST.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* SECTION 5: How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy rounded-3xl p-6 sm:p-10 text-white shadow-card space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron">
              Simple 4-Step Preparation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How ExamSnap Formats Your Documents
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              No software installations, no complex editing apps. Upload, adjust, and download in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-navy-800/80 p-5 rounded-2xl border border-navy-700 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-saffron text-navy font-extrabold text-sm flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-white">Select Exam or Size</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Choose SSC, UPSC, Railway, Banking, or enter your own custom width, height, and target KB limit.
              </p>
            </div>

            <div className="bg-navy-800/80 p-5 rounded-2xl border border-navy-700 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-saffron text-navy font-extrabold text-sm flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-white">Upload Photograph</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Snap a photo from your phone camera or upload any JPG, PNG, or WebP from your gallery.
              </p>
            </div>

            <div className="bg-navy-800/80 p-5 rounded-2xl border border-navy-700 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-saffron text-navy font-extrabold text-sm flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-white">Crop & Clean in Browser</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Drag handles to frame your face or signature. Clean paper shadows or add candidate DOP date stamps.
              </p>
            </div>

            <div className="bg-navy-800/80 p-5 rounded-2xl border border-navy-700 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-saffron text-navy font-extrabold text-sm flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-sm text-white">Instant Safe Download</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Download your perfectly compressed, portal-compliant JPEG or printable A4 sheet with zero watermark.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Local Client-Side Privacy Guarantee */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50/70 rounded-3xl border border-emerald-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-bold text-emerald-900">
              100% Client-Side Privacy Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              Your photographs, signatures, and biometric thumb impressions are processed <strong>entirely in your device’s memory</strong>. We do not store, view, or transmit your images to any remote cloud server or external database. When you close this tab, your files disappear from browser memory.
            </p>
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-emerald-900">
              <span>✓ Zero Server Uploads</span>
              <span>✓ No Account Required</span>
              <span>✓ No Image Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Comprehensive FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Got questions about exam document formatting? Find answers below:
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-navy hover:bg-gray-50 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-navy' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: Non-Government Affiliation Disclaimer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-2xl p-4 sm:p-5 border border-gray-200 text-center space-y-1">
          <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
            Independent Document Utility Notice
          </p>
          <p className="text-[11px] text-gray-500 max-w-3xl mx-auto leading-relaxed">
            ExamSnap (Sarkari Doc Prep) is an independent client-side document formatting utility. It is <strong>NOT affiliated with, authorized by, endorsed by, or in any way associated with</strong> the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Boards (RRB), IBPS, NTA, or any central or state government recruitment authority. Candidates must independently verify upload requirements from official notification PDFs.
          </p>
        </div>
      </section>
    </div>
  );
};
