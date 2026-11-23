import React, { useState, useEffect } from 'react';
import { useExamPresets } from '../context/ExamPresetContext';
import { UploadArea } from '../components/common/UploadArea';
import { CanvasCropper } from '../components/editor/CanvasCropper';
import { SignatureControls } from '../components/editor/SignatureControls';
import { CompressionControls } from '../components/editor/CompressionControls';
import { PresetSpecsBadge } from '../components/editor/PresetSpecsBadge';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { DimensionControls } from '../components/editor/DimensionControls';
import { 
  loadImage, 
  processImageToCanvas, 
  CropRect, 
  ImageAdjustments,
  cmToPixels
} from '../utils/imageProcessing';
import { compressCanvasToTarget, CompressionResult } from '../utils/compression';
import { PenTool, RotateCcw, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

export const SignatureResizerTool: React.FC = () => {
  const { presets, selectedPreset, selectPresetById, getActiveDocumentSpec } = useExamPresets();
  const spec = getActiveDocumentSpec('signature');

  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);

  const [widthPx, setWidthPx] = useState<number>(spec?.requiredWidthPx || 472);
  const [heightPx, setHeightPx] = useState<number>(spec?.requiredHeightPx || 236);
  const [lockAspect, setLockAspect] = useState<boolean>(false);

  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    whiteBackgroundClean: true,
    cleanThreshold: 195,
    contrast: 30,
    brightness: 0,
    grayscale: false
  });

  const [minKb, setMinKb] = useState<number>(spec?.minKb || 10);
  const [maxKb, setMaxKb] = useState<number>(spec?.maxKb || 20);

  const [result, setResult] = useState<CompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (spec) {
      if (spec.requiredWidthPx && spec.requiredHeightPx) {
        setWidthPx(spec.requiredWidthPx);
        setHeightPx(spec.requiredHeightPx);
      } else if (spec.widthCm && spec.heightCm) {
        setWidthPx(cmToPixels(spec.widthCm, spec.dpi || 300));
        setHeightPx(cmToPixels(spec.heightCm, spec.dpi || 300));
      }
      setMinKb(spec.minKb);
      setMaxKb(spec.maxKb);
    }
  }, [selectedPreset, spec]);

  const handleFileSelect = async (file: File) => {
    try {
      setOriginalFile(file);
      setOriginalSizeKb(Number((file.size / 1024).toFixed(1)));
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (err: any) {
      alert(err.message || 'Failed to open image file.');
    }
  };

  useEffect(() => {
    if (!sourceImage) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const offscreenCanvas = processImageToCanvas(
          sourceImage,
          cropRect,
          widthPx,
          heightPx,
          {
            fillColor: '#FFFFFF',
            adjustments
          }
        );

        const compResult = await compressCanvasToTarget(offscreenCanvas, minKb, maxKb);

        if (isMounted) {
          setResult(compResult);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          const newUrl = URL.createObjectURL(compResult.blob);
          setPreviewUrl(newUrl);
        }
      } catch (err) {
        // handle error
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [sourceImage, cropRect, widthPx, heightPx, adjustments, minKb, maxKb]);

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSourceImage(null);
    setOriginalFile(null);
    setResult(null);
    setPreviewUrl(null);
  };

  const aspectRatio = widthPx / heightPx;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Signature Resizer (10KB - 20KB & Custom Dimensions)"
        description="Resize signature for SSC, UPSC, IBPS, Railways. Remove shadows, whiten background paper, and compress strictly between 10KB and 20KB."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-navy text-saffron">
              <PenTool className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
              Govt Exam Signature Resizer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Crop signatures, whiten grey paper, deepen ink strokes, and compress into portal limits (10KB–20KB).
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Exam Preset:
          </label>
          <div className="relative">
            <select
              value={selectedPreset?.id || ''}
              onChange={(e) => selectPresetById(e.target.value || null)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-navy cursor-pointer shadow-subtle"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
              <option value="">Custom Dimensions</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <PresetSpecsBadge
        preset={selectedPreset}
        spec={spec}
        documentType="signature"
      />

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            sampleType="signature"
            label="Upload Candidate Signature Photo"
            subLabel="Capture signature written in black or blue ink on white paper"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Cropper & Adjustments */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">
                Step 1: Crop Signature Tight to Bounds
              </span>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Signature
              </button>
            </div>

            <CanvasCropper
              image={sourceImage}
              aspectRatio={aspectRatio}
              lockAspect={lockAspect}
              showFaceGuide={false}
              onCropChange={setCropRect}
            />

            {/* Custom Interactive Dimensions (Increase/Decrease, Steppers, Presets, Lock) */}
            <DimensionControls
              widthPx={widthPx}
              heightPx={heightPx}
              toolType="signature"
              lockAspectDefault={lockAspect}
              onLockAspectChange={setLockAspect}
              onChange={(w, h) => {
                setWidthPx(w);
                setHeightPx(h);
              }}
            />

            {/* Signature Enhancement Controls */}
            <SignatureControls
              adjustments={adjustments}
              onChange={setAdjustments}
            />
          </div>

          {/* Right: Output & Controls */}
          <div className="lg:col-span-5 space-y-4">
            <CompressionControls
              minKb={minKb}
              maxKb={maxKb}
              onChangeRange={(min, max) => {
                setMinKb(min);
                setMaxKb(max);
              }}
              currentSizeKb={result?.sizeKb}
              originalSizeKb={originalSizeKb}
              isWithinTarget={result?.isWithinTarget}
            />

            <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-navy">
                  Cleaned Signature Output
                </span>
                {result && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy text-white">
                    {result.sizeKb} KB
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[140px]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Formatted Signature"
                    className="max-h-32 rounded shadow-xs border border-gray-300 bg-white object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-400">Rendering signature...</div>
                )}
              </div>

              {result && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5 ${
                    result.isWithinTarget
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {result.isWithinTarget ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                  <span>{result.message}</span>
                </div>
              )}

              <DownloadButton
                blob={result?.blob || null}
                filename={`${selectedPreset?.shortCode || 'signature'}_ready.jpg`}
                statType="signature"
                savedBytes={Math.max(0, (originalSizeKb - (result?.sizeKb || 0)) * 1024)}
                label="Download Signature (JPEG)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
