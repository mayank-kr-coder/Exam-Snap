import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadArea } from '../components/common/UploadArea';
import { SEOHead } from '../components/common/SEOHead';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  Maximize2, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface FileDetails {
  name: string;
  sizeBytes: number;
  sizeKb: number;
  sizeMb: number;
  type: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  previewUrl: string;
  isImage: boolean;
}

interface ExamRule {
  examName: string;
  category: string;
  docType: 'photo' | 'signature' | 'document';
  minKb: number;
  maxKb: number;
  requiredFormats: string[];
  recommendedDims?: string;
  fixToolRoute: string;
  fixToolName: string;
}

const EXAM_RULES: ExamRule[] = [
  {
    examName: 'SSC CGL / CHSL / MTS (Photo)',
    category: 'SSC',
    docType: 'photo',
    minKb: 20,
    maxKb: 50,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '3.5 × 4.5 cm (413 × 531 px)',
    fixToolRoute: '/tools/passport-photo-resizer',
    fixToolName: 'Passport Photo Resizer'
  },
  {
    examName: 'SSC CGL / CHSL / MTS (Signature)',
    category: 'SSC',
    docType: 'signature',
    minKb: 10,
    maxKb: 20,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '4.0 × 2.0 cm (472 × 236 px)',
    fixToolRoute: '/tools/signature-resizer',
    fixToolName: 'Signature Resizer'
  },
  {
    examName: 'UPSC Civil Services (Photo)',
    category: 'UPSC',
    docType: 'photo',
    minKb: 20,
    maxKb: 300,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '350 × 350 to 1000 × 1000 px',
    fixToolRoute: '/tools/passport-photo-resizer',
    fixToolName: 'Passport Photo Resizer'
  },
  {
    examName: 'UPSC Civil Services (Signature)',
    category: 'UPSC',
    docType: 'signature',
    minKb: 20,
    maxKb: 300,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '350 × 350 to 1000 × 1000 px',
    fixToolRoute: '/tools/signature-resizer',
    fixToolName: 'Signature Resizer'
  },
  {
    examName: 'IBPS Bank PO / Clerk (Photo)',
    category: 'Banking',
    docType: 'photo',
    minKb: 20,
    maxKb: 50,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '200 × 230 px',
    fixToolRoute: '/tools/passport-photo-resizer',
    fixToolName: 'Passport Photo Resizer'
  },
  {
    examName: 'IBPS Bank PO / Clerk (Signature)',
    category: 'Banking',
    docType: 'signature',
    minKb: 10,
    maxKb: 20,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '140 × 60 px',
    fixToolRoute: '/tools/signature-resizer',
    fixToolName: 'Signature Resizer'
  },
  {
    examName: 'Railway RRB ALP / NTPC (Photo)',
    category: 'Railway',
    docType: 'photo',
    minKb: 30,
    maxKb: 70,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '35 × 45 mm',
    fixToolRoute: '/tools/passport-photo-resizer',
    fixToolName: 'Passport Photo Resizer'
  },
  {
    examName: 'NTA JEE / NEET (Photo)',
    category: 'NTA',
    docType: 'photo',
    minKb: 10,
    maxKb: 200,
    requiredFormats: ['image/jpeg', 'image/jpg'],
    recommendedDims: '2 × 2 inch (1:1 Ratio)',
    fixToolRoute: '/tools/photo-compressor',
    fixToolName: 'Photo Compressor'
  },
  {
    examName: 'Govt Marksheet / Certificate (PDF)',
    category: 'Certificate',
    docType: 'document',
    minKb: 50,
    maxKb: 200,
    requiredFormats: ['application/pdf'],
    recommendedDims: 'Standard A4 Document',
    fixToolRoute: '/tools/pdf-compressor',
    fixToolName: 'PDF Compressor'
  }
];

export const FileSizeCheckerTool: React.FC = () => {
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'signature' | 'document'>('all');
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const previewUrl = URL.createObjectURL(file);

    const sizeBytes = file.size;
    const sizeKb = Number((sizeBytes / 1024).toFixed(2));
    const sizeMb = Number((sizeKb / 1024).toFixed(2));

    if (isImage) {
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(img.naturalWidth, img.naturalHeight);
        const ratioStr = `${img.naturalWidth / divisor}:${img.naturalHeight / divisor}`;

        setFileDetails({
          name: file.name,
          sizeBytes,
          sizeKb,
          sizeMb,
          type: file.type || 'image/jpeg',
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: ratioStr,
          previewUrl,
          isImage: true
        });
      };
    } else {
      setFileDetails({
        name: file.name,
        sizeBytes,
        sizeKb,
        sizeMb,
        type: file.type || 'application/octet-stream',
        previewUrl,
        isImage: false
      });
    }
  };

  const reset = () => {
    if (fileDetails?.previewUrl) {
      URL.revokeObjectURL(fileDetails.previewUrl);
    }
    setFileDetails(null);
  };

  const filteredRules = EXAM_RULES.filter((rule) => {
    if (filterType === 'all') return true;
    return rule.docType === filterType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Real-Time Image & File Size Checker (Exam Compliance Engine)"
        description="Check your photograph, signature or PDF size instantly. Verify if your file meets SSC, UPSC, IBPS and Railway upload size limits in KB with zero server uploads."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-navy text-saffron">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
              Real-Time File Size & Exam Compliance Checker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Drop any photo, signature or certificate to see exact size in KB and verify acceptance for SSC, UPSC, IBPS and Railways.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">100% Private (Checked in Browser)</span>
        </div>
      </div>

      {!fileDetails ? (
        <div className="space-y-4">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Photo, Signature or Document"
            subLabel="Drag & drop JPG, PNG, WebP or PDF to check exact file size and portal compliance"
            allowedExtensions={['jpg', 'jpeg', 'png', 'webp', 'pdf']}
          />

          {/* Quick demo card info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-navy block mb-0.5">SSC Requirement</span>
              <p className="text-[11px] text-gray-500">Photo: 20–50 KB | Signature: 10–20 KB (JPEG)</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-navy block mb-0.5">UPSC Requirement</span>
              <p className="text-[11px] text-gray-500">Photo & Sign: 20–300 KB | Min 350×350 px</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-navy block mb-0.5">Banking (IBPS/SBI)</span>
              <p className="text-[11px] text-gray-500">Photo: 20–50 KB | Sign & Thumb: 10–20 KB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top File Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                {fileDetails.isImage ? (
                  <img
                    src={fileDetails.previewUrl}
                    alt="Preview"
                    className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-gray-50 p-1"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-navy/5 flex items-center justify-center text-navy border border-gray-200">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-navy max-w-md truncate" title={fileDetails.name}>
                    {fileDetails.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                    Format: {fileDetails.type.toUpperCase()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Check Another File</span>
              </button>
            </div>

            {/* Exact Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-brand-lightBg p-3 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                  File Size (KB)
                </span>
                <span className="text-lg font-mono font-extrabold text-navy">
                  {fileDetails.sizeKb} <span className="text-xs font-normal">KB</span>
                </span>
              </div>

              <div className="bg-brand-lightBg p-3 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                  Exact Bytes
                </span>
                <span className="text-sm font-mono font-bold text-gray-700">
                  {fileDetails.sizeBytes.toLocaleString()} B
                </span>
              </div>

              <div className="bg-brand-lightBg p-3 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                  Dimensions (px)
                </span>
                <span className="text-sm font-mono font-bold text-gray-700">
                  {fileDetails.width && fileDetails.height
                    ? `${fileDetails.width} × ${fileDetails.height}`
                    : 'N/A (Document)'}
                </span>
              </div>

              <div className="bg-brand-lightBg p-3 rounded-xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-0.5">
                  Aspect Ratio
                </span>
                <span className="text-sm font-mono font-bold text-gray-700">
                  {fileDetails.aspectRatio || 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Exam Portal Compliance Status Matrix */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-saffron-dark" />
                  Government Examination Acceptance Matrix
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Evaluating this file against strict recruitment portal upload criteria:
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    filterType === 'all' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('photo')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    filterType === 'photo' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Photos
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('signature')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    filterType === 'signature' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Signatures
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('document')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    filterType === 'document' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                  }`}
                >
                  Certificates
                </button>
              </div>
            </div>

            {/* List of Exams and pass/fail cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRules.map((rule) => {
                const isFormatOk =
                  rule.requiredFormats.includes(fileDetails.type) ||
                  (fileDetails.type === 'image/jpg' && rule.requiredFormats.includes('image/jpeg'));
                const isSizeOk =
                  fileDetails.sizeKb >= rule.minKb && fileDetails.sizeKb <= rule.maxKb;
                const isPassing = isFormatOk && isSizeOk;

                let reason = '';
                if (!isFormatOk) {
                  reason = `Invalid format (${fileDetails.type.replace('image/', '')}). Needs JPEG/JPG.`;
                } else if (fileDetails.sizeKb > rule.maxKb) {
                  reason = `Too large: ${fileDetails.sizeKb} KB (Max allowed: ${rule.maxKb} KB)`;
                } else if (fileDetails.sizeKb < rule.minKb) {
                  reason = `Too small: ${fileDetails.sizeKb} KB (Min required: ${rule.minKb} KB)`;
                }

                return (
                  <div
                    key={rule.examName}
                    className={`p-3.5 rounded-xl border transition ${
                      isPassing
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-navy text-white">
                            {rule.category}
                          </span>
                          <span className="text-xs font-bold text-navy">{rule.examName}</span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Allowed: <span className="font-semibold">{rule.minKb} – {rule.maxKb} KB</span> • {rule.recommendedDims}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {isPassing ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Passes Upload
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Will Reject
                          </span>
                        )}
                      </div>
                    </div>

                    {!isPassing && (
                      <div className="mt-2.5 pt-2 border-t border-rose-200/70 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-rose-700">
                          {reason}
                        </span>

                        <Link
                          to={rule.fixToolRoute}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-navy hover:bg-navy-800 px-2.5 py-1 rounded-lg shadow-xs transition"
                        >
                          <span>Fix with {rule.fixToolName}</span>
                          <ArrowRight className="w-3 h-3 text-saffron" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
