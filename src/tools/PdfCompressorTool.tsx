import React, { useState } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { optimizePdf, PdfProcessingResult } from '../utils/pdfProcessing';
import { 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';

export const PdfCompressorTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<PdfProcessingResult | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setSelectedFile(file);
      setIsProcessing(true);
      const res = await optimizePdf(file);
      setResult(res);
      setIsProcessing(false);
    } catch (e: any) {
      setIsProcessing(false);
      alert(e.message || 'Failed to process PDF file. It might be password-protected or corrupted.');
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setResult(null);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="PDF Compressor for Govt Exam Certificates (10th Marksheet, Caste, EWS)"
        description="Compress PDF documents below 200KB or 300KB for government exam application portals. 100% private offline compression in your browser."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <FileText className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Govt Exam PDF Compressor
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Optimize educational certificates, category/caste certificates, and marksheets to fit portal limits (typically &lt; 200KB or 300KB).
        </p>
      </div>

      {!selectedFile ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            isPdf={true}
            maxSizeMb={25}
            label="Upload Certificate or Document PDF"
            subLabel="Standard PDF up to 25MB (10th Marksheet, Caste, EWS, Domicile)"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-dark truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </h3>
                <span className="text-xs text-gray-500">
                  Original: {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Change PDF
            </button>
          </div>

          {isProcessing ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-navy border-t-saffron rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-navy">
                Optimizing object streams and structures with pdf-lib...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Comparison Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-brand-lightBg p-4 rounded-xl border border-gray-100">
                  <span className="text-gray-500 text-xs block mb-1">Original Size</span>
                  <span className="font-mono text-xl font-bold text-gray-700">
                    {result.originalSizeKb} KB
                  </span>
                </div>

                <div className="bg-brand-lightBg p-4 rounded-xl border border-gray-100">
                  <span className="text-gray-500 text-xs block mb-1">Optimized Size</span>
                  <span className="font-mono text-xl font-bold text-navy">
                    {result.newSizeKb} KB
                  </span>
                </div>

                <div className="bg-brand-lightBg p-4 rounded-xl border border-gray-100">
                  <span className="text-gray-500 text-xs block mb-1">Status / Saved</span>
                  <span className={`text-base font-bold ${result.isCompressed ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {result.isCompressed ? `${result.compressionRatioPercent}% Saved` : 'Already Optimal'}
                  </span>
                </div>
              </div>

              {/* Status Notice */}
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  result.isCompressed
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
              >
                {result.isCompressed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
                <span>{result.message}</span>
              </div>

              {/* Download CTA */}
              <DownloadButton
                blob={result.pdfBlob}
                filename={`${selectedFile.name.replace(/\.[^/.]+$/, '')}_optimized.pdf`}
                statType="pdf"
                savedBytes={Math.max(0, result.originalSizeBytes - result.newSizeBytes)}
                label="Download Optimized PDF"
              />

              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PDF never sent to any server. Processed safely inside your browser.</span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
