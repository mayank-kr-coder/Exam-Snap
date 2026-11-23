import React, { useState } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { useExamPresets } from '../context/ExamPresetContext';
import { usePayment } from '../context/PaymentContext';
import { SEOHead } from '../components/common/SEOHead';
import { DownloadButton } from '../components/common/DownloadButton';
import { loadImage, processImageToCanvas, CropRect } from '../utils/imageProcessing';
import { compressCanvasToTarget } from '../utils/compression';
import { 
  createSamplePassportPhotoBlob, 
  createSampleSignatureBlob, 
  createSampleThumbprintBlob 
} from '../utils/sampleImages';
import { 
  Sparkles, 
  Crown, 
  Upload, 
  CheckCircle2, 
  FileCheck2, 
  ArrowRight, 
  Camera, 
  PenTool, 
  Fingerprint,
  Archive,
  Download,
  RotateCcw
} from 'lucide-react';

export const BatchDossierPage: React.FC = () => {
  const { presets, selectedPreset, selectPresetById } = useExamPresets();
  const { isPremium, openPaymentModal } = usePayment();

  // Multi-file state
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoSizeKb, setPhotoSizeKb] = useState<number>(0);

  const [signBlob, setSignBlob] = useState<Blob | null>(null);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [signSizeKb, setSignSizeKb] = useState<number>(0);

  const [thumbBlob, setThumbBlob] = useState<Blob | null>(null);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [thumbSizeKb, setThumbSizeKb] = useState<number>(0);

  const [candidateName, setCandidateName] = useState('MAYANK KUMAR');
  const [isZipping, setIsZipping] = useState(false);

  // Process photo
  const processPhotoFile = async (file: File) => {
    const spec = selectedPreset?.documents.photo;
    const img = await loadImage(file);
    const targetW = spec?.requiredWidthPx || 413;
    const targetH = spec?.requiredHeightPx || 531;

    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const crop: CropRect = {
      x: Math.round(imgW * 0.1),
      y: Math.round(imgH * 0.05),
      width: Math.round(imgW * 0.8),
      height: Math.round(imgH * 0.85)
    };

    const canvas = processImageToCanvas(img, crop, targetW, targetH, {
      fillColor: '#FFFFFF',
      stamp: spec?.requireDateStamp ? {
        enabled: true,
        name: candidateName.toUpperCase(),
        date: 'DOP: ' + new Date().toLocaleDateString('en-GB')
      } : undefined
    });

    const res = await compressCanvasToTarget(canvas, spec?.minKb || 20, spec?.maxKb || 50);
    setPhotoBlob(res.blob);
    setPhotoSizeKb(res.sizeKb);
    setPhotoUrl(URL.createObjectURL(res.blob));
  };

  // Process signature
  const processSignFile = async (file: File) => {
    const spec = selectedPreset?.documents.signature;
    const img = await loadImage(file);
    const targetW = spec?.requiredWidthPx || 472;
    const targetH = spec?.requiredHeightPx || 236;

    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const crop: CropRect = { x: 0, y: 0, width: imgW, height: imgH };

    const canvas = processImageToCanvas(img, crop, targetW, targetH, {
      fillColor: '#FFFFFF',
      adjustments: {
        whiteBackgroundClean: true,
        cleanThreshold: 195,
        contrast: 35
      }
    });

    const res = await compressCanvasToTarget(canvas, spec?.minKb || 10, spec?.maxKb || 20);
    setSignBlob(res.blob);
    setSignSizeKb(res.sizeKb);
    setSignUrl(URL.createObjectURL(res.blob));
  };

  // Process thumbprint
  const processThumbFile = async (file: File) => {
    const spec = selectedPreset?.documents.thumb;
    const img = await loadImage(file);
    const targetW = spec?.requiredWidthPx || 240;
    const targetH = spec?.requiredHeightPx || 240;

    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const crop: CropRect = { x: 0, y: 0, width: imgW, height: imgH };

    const canvas = processImageToCanvas(img, crop, targetW, targetH, {
      fillColor: '#FFFFFF',
      adjustments: {
        whiteBackgroundClean: true,
        cleanThreshold: 200,
        contrast: 40
      }
    });

    const res = await compressCanvasToTarget(canvas, spec?.minKb || 10, spec?.maxKb || 20);
    setThumbBlob(res.blob);
    setThumbSizeKb(res.sizeKb);
    setThumbUrl(URL.createObjectURL(res.blob));
  };

  // One-click demo populate
  const handleLoadDemoDossier = async () => {
    const [photo, sign, thumb] = await Promise.all([
      createSamplePassportPhotoBlob(),
      createSampleSignatureBlob(),
      createSampleThumbprintBlob()
    ]);
    await Promise.all([
      processPhotoFile(photo),
      processSignFile(sign),
      processThumbFile(thumb)
    ]);
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    if (!photoBlob && !signBlob && !thumbBlob) return;

    setIsZipping(true);
    const zip = new JSZip();
    const prefix = selectedPreset?.shortCode || 'ExamSnap';

    if (photoBlob) {
      zip.file(`${prefix}_01_Passport_Photo.jpg`, photoBlob);
    }
    if (signBlob) {
      zip.file(`${prefix}_02_Signature.jpg`, signBlob);
    }
    if (thumbBlob) {
      zip.file(`${prefix}_03_Thumb_Impression.jpg`, thumbBlob);
    }

    // Add upload instructions README in zip
    const readmeContent = `====================================================
EXAM SNAP (SARKARI DOC PREP) — EXAM APPLICATION DOSSIER
Target Examination: ${selectedPreset?.name || 'General Govt Exam'}
Verified Date: ${selectedPreset?.lastVerifiedDate || '2026'}
====================================================

YOUR FORMATTED FILES IN THIS DOSSIER:
1. ${prefix}_01_Passport_Photo.jpg
   - Dimensions: ${selectedPreset?.documents.photo?.requiredWidthPx}x${selectedPreset?.documents.photo?.requiredHeightPx} px
   - File Size: ${photoSizeKb} KB (Target: ${selectedPreset?.documents.photo?.minKb}-${selectedPreset?.documents.photo?.maxKb} KB)
   - Status: Ready for Portal Upload

2. ${prefix}_02_Signature.jpg
   - Dimensions: ${selectedPreset?.documents.signature?.requiredWidthPx}x${selectedPreset?.documents.signature?.requiredHeightPx} px
   - File Size: ${signSizeKb} KB (Target: ${selectedPreset?.documents.signature?.minKb}-${selectedPreset?.documents.signature?.maxKb} KB)
   - Status: Cleaned White Paper with High-Contrast Ink

3. ${prefix}_03_Thumb_Impression.jpg
   - Left Thumb Impression (LTI) Ready

PRIVACY NOTICE:
All files were generated client-side inside your browser. No biometric records were kept.
Good luck with your examination!
====================================================`;

    zip.file('Upload_Instructions.txt', readmeContent);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}_Application_Dossier.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setIsZipping(false);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FF9933', '#14213D', '#2563EB']
      });
    } catch (e) {
      // ignore
    }
  };

  const hasAnyReady = Boolean(photoBlob || signBlob || thumbBlob);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Batch Exam Dossier Studio - 1-Click All Documents (.ZIP)"
        description="Prepare your Passport Photo, Signature, and Thumb Impression together in 1 click and download as a single Exam Dossier ZIP."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-saffron/20 border border-saffron/40 flex items-center justify-center text-saffron-dark font-extrabold shadow-sm">
            <Crown className="w-5 h-5 text-saffron-dark fill-saffron" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
                Batch Exam Dossier Studio
              </h1>
              {isPremium ? (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Unlocked
                </span>
              ) : (
                <span className="bg-saffron/20 text-saffron-dark text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Exam Pack
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Prepare Photo + Signature + Thumb simultaneously and download as a single dossier ZIP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadDemoDossier}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-saffron/15 text-navy-900 border border-saffron/40 hover:bg-saffron/25 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
            <span>Load Demo Dossier</span>
          </button>

          <select
            value={selectedPreset?.id || 'ssc-cgl-chsl'}
            onChange={(e) => selectPresetById(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-navy shadow-subtle"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Premium gate banner if not yet unlocked */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-navy to-navy-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-elevated">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-saffron flex-shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Unlock 1-Click All-in-One Dossier Processing (₹29)
              </h3>
              <p className="text-xs text-gray-300">
                Format photos, signatures, thumb impressions, and certificates together in one click with zero ads.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openPaymentModal}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-saffron hover:bg-saffron-light text-navy-900 transition flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <span>Unlock for ₹29</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1-Click ZIP Download Action Bar */}
      {hasAnyReady && (
        <div className="bg-white p-4 rounded-2xl border-2 border-navy shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-saffron flex items-center justify-center font-bold">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy">
                Complete Exam Application Dossier Ready
              </h3>
              <p className="text-xs text-gray-500">
                Includes all formatted JPEGs + Official Upload Verification Guide.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs text-white bg-navy hover:bg-navy-800 shadow-elevated transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-saffron" />
            <span>{isZipping ? 'Archiving Files...' : 'Download Complete Dossier (.ZIP)'}</span>
          </button>
        </div>
      )}

      {/* Batch Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Slot 1: Photo */}
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-navy flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-brand-blue" />
                1. Passport Photo
              </span>
              <span className="text-[11px] font-mono font-semibold text-gray-500">
                {selectedPreset?.documents.photo?.minKb || 20}–{selectedPreset?.documents.photo?.maxKb || 50} KB
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {selectedPreset?.documents.photo?.requiredWidthPx} × {selectedPreset?.documents.photo?.requiredHeightPx} px
            </p>

            <div className="flex justify-center items-center bg-brand-lightBg rounded-xl border border-gray-200 h-44 overflow-hidden relative">
              {photoUrl ? (
                <img src={photoUrl} alt="Ready Photo" className="h-full object-contain" />
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-gray-100 transition">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs font-semibold text-navy">Upload Photo</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">JPG / PNG</span>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && processPhotoFile(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            {photoBlob && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mb-2 flex items-center justify-between font-mono">
                <span>Formatted Ready</span>
                <span>{photoSizeKb} KB</span>
              </div>
            )}
            <DownloadButton
              blob={photoBlob}
              filename={`${selectedPreset?.shortCode || 'exam'}_photo.jpg`}
              statType="photo"
              label="Download Photo"
            />
          </div>
        </div>

        {/* Slot 2: Signature */}
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-navy flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-saffron-dark" />
                2. Signature
              </span>
              <span className="text-[11px] font-mono font-semibold text-gray-500">
                {selectedPreset?.documents.signature?.minKb || 10}–{selectedPreset?.documents.signature?.maxKb || 20} KB
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {selectedPreset?.documents.signature?.requiredWidthPx} × {selectedPreset?.documents.signature?.requiredHeightPx} px (Clean White Paper)
            </p>

            <div className="flex justify-center items-center bg-brand-lightBg rounded-xl border border-gray-200 h-44 overflow-hidden relative">
              {signUrl ? (
                <img src={signUrl} alt="Ready Signature" className="h-full object-contain" />
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-gray-100 transition">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs font-semibold text-navy">Upload Signature</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Black or Blue ink</span>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && processSignFile(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            {signBlob && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mb-2 flex items-center justify-between font-mono">
                <span>Formatted Ready</span>
                <span>{signSizeKb} KB</span>
              </div>
            )}
            <DownloadButton
              blob={signBlob}
              filename={`${selectedPreset?.shortCode || 'exam'}_sign.jpg`}
              statType="signature"
              label="Download Signature"
            />
          </div>
        </div>

        {/* Slot 3: Thumbprint / LTI */}
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-navy flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-indigo-600" />
                3. Thumb Impression (LTI)
              </span>
              <span className="text-[11px] font-mono font-semibold text-gray-500">
                10–20 KB
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Square 240 × 240 px (IBPS / Railways / NTA)
            </p>

            <div className="flex justify-center items-center bg-brand-lightBg rounded-xl border border-gray-200 h-44 overflow-hidden relative">
              {thumbUrl ? (
                <img src={thumbUrl} alt="Ready Thumbprint" className="h-full object-contain" />
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 hover:bg-gray-100 transition">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs font-semibold text-navy">Upload Thumbprint</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Blue ink impression</span>
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && processThumbFile(e.target.files[0])} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            {thumbBlob && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg mb-2 flex items-center justify-between font-mono">
                <span>Formatted Ready</span>
                <span>{thumbSizeKb} KB</span>
              </div>
            )}
            <DownloadButton
              blob={thumbBlob}
              filename={`${selectedPreset?.shortCode || 'exam'}_thumb.jpg`}
              statType="photo"
              label="Download Thumbprint"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
