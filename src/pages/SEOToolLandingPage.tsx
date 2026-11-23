import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { PassportPhotoTool } from '../tools/PassportPhotoTool';
import { SignatureResizerTool } from '../tools/SignatureResizerTool';
import { ImageCompressorTool } from '../tools/ImageCompressorTool';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  FileCheck2, 
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface SEOCfg {
  title: string;
  metaDesc: string;
  headline: string;
  examName: string;
  toolType: 'passport' | 'signature' | 'compressor';
  presetId?: string;
  specs: {
    photoDim: string;
    photoSize: string;
    signDim: string;
    signSize: string;
    format: string;
    bgRequirement: string;
  };
  rules: string[];
  faqs: { q: string; a: string }[];
}

const SEO_PAGES: Record<string, SEOCfg> = {
  'ssc-photo-resizer': {
    title: 'SSC Photo Resizer (3.5 x 4.5 cm / 20KB - 50KB) CGL, CHSL, MTS, GD',
    metaDesc: 'Resize and crop photograph for SSC CGL, CHSL, MTS and GD Constable applications. Exactly 3.5cm x 4.5cm, 20KB to 50KB JPEG with clean white background.',
    headline: 'Official SSC Photo Resizer & Compressor 2026',
    examName: 'Staff Selection Commission (SSC)',
    toolType: 'passport',
    presetId: 'ssc-cgl-chsl',
    specs: {
      photoDim: '3.5 cm × 4.5 cm (approx 413 × 531 pixels at 300 DPI)',
      photoSize: '20 KB to 50 KB (Strict boundary)',
      signDim: '4.0 cm × 2.0 cm (approx 472 × 236 pixels)',
      signSize: '10 KB to 20 KB (Strict boundary)',
      format: 'JPEG / JPG only',
      bgRequirement: 'Plain white or light off-white background. Both ears must be clearly visible.'
    },
    rules: [
      'Face must cover approximately 60% to 70% of the entire photograph area.',
      'Both ears must be clearly visible without shadow obstructions.',
      'Caps, masks, hoods, and dark or tinted spectacles are strictly forbidden and cause instant rejection.',
      'Signatures in CAPITAL LETTERS are not accepted by the SSC scrutiny cell.'
    ],
    faqs: [
      {
        q: 'What is the required photo size for SSC CGL and CHSL?',
        a: 'The photo file size must strictly be between 20 KB and 50 KB in JPG format, with dimensions of 3.5 cm width by 4.5 cm height.'
      },
      {
        q: 'Does SSC reject photos without a date stamp?',
        a: 'Under the latest SSC guidelines, recent clear color photos taken against a plain light background without date stamp are accepted, though live webcam capture on the portal is also verified against this uploaded photograph.'
      }
    ]
  },
  'upsc-photo-resizer': {
    title: 'UPSC Photo & Signature Resizer (350x350 px, 20KB-300KB) CSE, NDA, CDS',
    metaDesc: 'Prepare passport photograph and signature for UPSC Civil Services (IAS/IPS), NDA, CDS, and CDS examinations. 350x350px min with name and date stamp.',
    headline: 'UPSC Civil Services Photo & Signature Formatter',
    examName: 'Union Public Service Commission (UPSC)',
    toolType: 'passport',
    presetId: 'upsc-civil-services',
    specs: {
      photoDim: '350 × 350 pixels (Aspect ratio 1:1 square, minimum)',
      photoSize: '20 KB to 300 KB',
      signDim: '350 × 140 pixels (minimum)',
      signSize: '20 KB to 300 KB',
      format: 'JPG / JPEG',
      bgRequirement: 'Plain white background with sharp contrast.'
    },
    rules: [
      'UPSC notification explicitly states: Candidate name and date of photo must be printed at the bottom of the photograph.',
      'Photo must not be older than 10 days from the opening date of the online application portal.',
      'The candidates appearance in the exam hall must match the uploaded photograph (e.g. beard/spectacles).'
    ],
    faqs: [
      {
        q: 'Is candidate name and date compulsory on UPSC photo?',
        a: 'Yes, as per recent UPSC OTR and examination notifications, the candidates full name and date on which the photo was taken should be clearly visible on the lower section of the image.'
      }
    ]
  },
  'railway-photo-resizer': {
    title: 'Railway (RRB) Photo Resizer - RRB NTPC, Group D, ALP 35x45mm (20KB-50KB)',
    metaDesc: 'Resize photo and signature for Railway Recruitment Board exams (RRB NTPC, Group D, ALP, Technician). Exactly 35x45 mm, 20KB-50KB with white background.',
    headline: 'Railway RRB Photo & Signature Resizer',
    examName: 'Railway Recruitment Control Board (RRB)',
    toolType: 'passport',
    presetId: 'railway-rrb',
    specs: {
      photoDim: '35 mm × 45 mm (approx 413 × 531 pixels)',
      photoSize: '20 KB to 50 KB',
      signDim: '50 mm × 20 mm (running hand)',
      signSize: '10 KB to 40 KB',
      format: 'JPEG format',
      bgRequirement: 'Strict solid white background.'
    },
    rules: [
      'Frontal view looking directly into the camera with neutral expression.',
      'Selfies, mobile screenshots, or photographs taken wearing goggles will lead to cancellation of candidature.',
      'Clear, unsmudged signature inside a rectangular frame.'
    ],
    faqs: [
      {
        q: 'Can I upload a photo with blue background in RRB NTPC?',
        a: 'RRB notifications strongly emphasize a solid white background. Avoid dark or colored backgrounds to prevent automatic rejection by the portal validation filter.'
      }
    ]
  }
};

export const SEOToolLandingPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const pageData = toolSlug ? SEO_PAGES[toolSlug] : null;

  if (!pageData) {
    // Fallback directly to passport photo tool
    return <PassportPhotoTool />;
  }

  return (
    <div className="space-y-10 pb-16">
      <SEOHead
        title={pageData.title}
        description={pageData.metaDesc}
      />

      {/* Hero notice */}
      <div className="bg-navy text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-saffron text-navy-900 px-2.5 py-0.5 rounded-full">
              {pageData.examName}
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Offline Private
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {pageData.headline}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
            {pageData.metaDesc}
          </p>
        </div>
      </div>

      {/* Embedded Live Tool */}
      <div className="-mt-6">
        <PassportPhotoTool />
      </div>

      {/* Specification breakdown guide */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
          <h2 className="text-xl font-bold text-navy">
            Official Document Specifications & Upload Criteria
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-brand-lightBg rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-400 uppercase font-semibold">Photo Dimensions</span>
              <p className="font-mono font-bold text-navy text-sm">{pageData.specs.photoDim}</p>
            </div>
            <div className="p-4 bg-brand-lightBg rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-400 uppercase font-semibold">Photo File Size</span>
              <p className="font-mono font-bold text-navy text-sm">{pageData.specs.photoSize}</p>
            </div>
            <div className="p-4 bg-brand-lightBg rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-400 uppercase font-semibold">Signature Limits</span>
              <p className="font-mono font-bold text-navy text-sm">{pageData.specs.signSize}</p>
            </div>
            <div className="p-4 bg-brand-lightBg rounded-xl border border-gray-100 space-y-1">
              <span className="text-gray-400 uppercase font-semibold">Accepted Format</span>
              <p className="font-mono font-bold text-navy text-sm">{pageData.specs.format}</p>
            </div>
            <div className="p-4 bg-brand-lightBg rounded-xl border border-gray-100 space-y-1 sm:col-span-2">
              <span className="text-gray-400 uppercase font-semibold">Background Requirement</span>
              <p className="font-medium text-brand-dark text-sm">{pageData.specs.bgRequirement}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm text-navy mb-3">Important Scrutiny Rules:</h3>
            <ul className="space-y-2 text-xs text-gray-700">
              {pageData.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-bold text-navy">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {pageData.faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-brand-lightBg border border-gray-100 space-y-1.5">
                <h4 className="font-bold text-sm text-brand-dark">{faq.q}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
