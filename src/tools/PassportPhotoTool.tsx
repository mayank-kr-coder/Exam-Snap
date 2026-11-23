import React, { useState, useEffect, useRef } from 'react';
import { useExamPresets } from '../context/ExamPresetContext';
import { UploadArea } from '../components/common/UploadArea';
import { CanvasCropper } from '../components/editor/CanvasCropper';
import { DateStampControls } from '../components/editor/DateStampControls';
import { BackgroundControls } from '../components/editor/BackgroundControls';
import { CompressionControls } from '../components/editor/CompressionControls';
import { PresetSpecsBadge } from '../components/editor/PresetSpecsBadge';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { DimensionControls } from '../components/editor/DimensionControls';
import { 
  loadImage, 
  processImageToCanvas, 
  CropRect, 
  StampOptions, 
  ImageAdjustments,
  cmToPixels
} from '../utils/imageProcessing';
import { compressCanvasToTarget, CompressionResult } from '../utils/compression';
import { 
  Camera, 
  RotateCcw, 
  Sparkles, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  ChevronDown
} from 'lucide-react';

export const PassportPhotoTool: React.FC = () => {
  const { presets, selectedPreset, selectPresetById, getActiveDocumentSpec } = useExamPresets();
  const spec = getActiveDocumentSpec('photo');

  // Image source state
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);

  // Dimension settings
  const [widthPx, setWidthPx] = useState<number>(spec?.requiredWidthPx || 413);
  const [heightPx, setHeightPx] = useState<number>(spec?.requiredHeightPx || 531);
  const [dimensionMode, setDimensionMode] = useState<'px' | 'cm'>('px');
  const [widthCm, setWidthCm] = useState<number>(spec?.widthCm || 3.5);
  const [heightCm, setHeightCm] = useState<number>(spec?.heightCm || 4.5);
  const [dpi, setDpi] = useState<number>(spec?.dpi || 300);

  // Crop & processing state
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });
  const [stamp, setStamp] = useState<StampOptions>({
    enabled: Boolean(spec?.requireDateStamp || spec?.requireNameStamp),
    name: '',
    date: 'DOP: ' + new Date().toLocaleDateString('en-GB'),
    position: 'bottom',
    fontSize: 14
  });

  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    replaceBackground: false,
    bgTolerance: 45,
    targetBgColor: '#FFFFFF'
  });

  // Compression range
  const [minKb, setMinKb] = useState<number>(spec?.minKb || 20);
  const [maxKb, setMaxKb] = useState<number>(spec?.maxKb || 50);

  // Result output
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Sync with preset changes
  useEffect(() => {
    if (spec) {
      if (spec.requiredWidthPx && spec.requiredHeightPx) {
        setWidthPx(spec.requiredWidthPx);
        setHeightPx(spec.requiredHeightPx);
      } else if (spec.widthCm && spec.heightCm) {
        setWidthCm(spec.widthCm);
        setHeightCm(spec.heightCm);
        setWidthPx(cmToPixels(spec.widthCm, spec.dpi || 300));
        setHeightPx(cmToPixels(spec.heightCm, spec.dpi || 300));
      }
      setMinKb(spec.minKb);
      setMaxKb(spec.maxKb);
      if (spec.requireDateStamp || spec.requireNameStamp) {
        setStamp((prev) => ({ ...prev, enabled: true }));
      }
    }
  }, [selectedPreset, spec]);

  // Handle file upload
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

  // Convert CM to PX when dimension changes
  const handleCmChange = (newW: number, newH: number, newDpi: number) => {
    setWidthCm(newW);
    setHeightCm(newH);
    setDpi(newDpi);
    setWidthPx(cmToPixels(newW, newDpi));
    setHeightPx(cmToPixels(newH, newDpi));
  };

  // Re-process image whenever crop, adjustments, stamp, dimensions or limits change
  useEffect(() => {
    if (!sourceImage) return;

    let isMounted = true;
    setIsProcessing(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const offscreenCanvas = processImageToCanvas(
          sourceImage,
          cropRect,
          widthPx,
          heightPx,
          {
            fillColor: '#FFFFFF',
            adjustments,
            stamp
          }
        );

        const compResult = await compressCanvasToTarget(offscreenCanvas, minKb, maxKb);

        if (isMounted) {
          setResult(compResult);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          const newUrl = URL.createObjectURL(compResult.blob);
          setPreviewUrl(newUrl);
          setIsProcessing(false);
        }
      } catch (err) {
        if (isMounted) setIsProcessing(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [sourceImage, cropRect, widthPx, heightPx, stamp, adjustments, minKb, maxKb]);

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
        title="Passport Photo Resizer (3.5 x 4.5 cm / 20KB - 50KB)"
        description="Free online passport photograph resizer and compressor for SSC, UPSC, IBPS, RRB and state government exam application forms. 100% private offline."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-navy text-saffron">
              <Camera className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
              Passport Photo Resizer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Format photo dimensions (3.5 × 4.5 cm), DPI, white background, name/date stamp, and target 20KB–50KB.
          </p>
        </div>

        {/* Preset Selector Dropdown */}
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
                  {p.name} {p.status === 'verified' ? '✓' : '(Demo)'}
                </option>
              ))}
              <option value="">Custom / Freeform</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Preset specs badge */}
      <PresetSpecsBadge
        preset={selectedPreset}
        spec={spec}
        documentType="photo"
      />

      {/* Main Workspace */}
      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Candidate Passport Photo"
            subLabel="JPG, PNG, WEBP from your phone camera or gallery (Max 15MB)"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Canvas Cropper */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Settings2 className="w-4 h-4 text-saffron" />
                Step 1: Position & Crop Photo
              </span>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Image
              </button>
            </div>

            <CanvasCropper
              image={sourceImage}
              aspectRatio={aspectRatio}
              lockAspect={true}
              showFaceGuide={true}
              onCropChange={setCropRect}
            />

            {/* Dimension Controls Accordion/Row */}
            <div className="bg-brand-lightBg p-3.5 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">Dimensions & Resolution</span>
                <div className="flex bg-white rounded-lg p-0.5 border border-gray-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setDimensionMode('px')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      dimensionMode === 'px' ? 'bg-navy text-white shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Pixels (px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDimensionMode('cm')}
                    className={`px-2.5 py-1 rounded-md font-medium transition ${
                      dimensionMode === 'cm' ? 'bg-navy text-white shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    Physical (cm / DPI)
                  </button>
                </div>
              </div>

              {dimensionMode === 'px' ? (
                <DimensionControls
                  widthPx={widthPx}
                  heightPx={heightPx}
                  toolType="photo"
                  lockAspectDefault={true}
                  onChange={(w, h) => {
                    setWidthPx(w);
                    setHeightPx(h);
                  }}
                />
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Width (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={widthCm}
                      onChange={(e) => handleCmChange(Number(e.target.value), heightCm, dpi)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={heightCm}
                      onChange={(e) => handleCmChange(widthCm, Number(e.target.value), dpi)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-1">DPI</label>
                    <select
                      value={dpi}
                      onChange={(e) => handleCmChange(widthCm, heightCm, Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs font-mono border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="200">200 DPI</option>
                      <option value="300">300 DPI (High)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Date Stamp Controls */}
            <DateStampControls
              stamp={stamp}
              onChange={setStamp}
              requiredByPreset={Boolean(spec?.requireDateStamp)}
            />

            {/* Background Controls */}
            <BackgroundControls
              adjustments={adjustments}
              onChange={setAdjustments}
            />
          </div>

          {/* Right Column: Live Output & Compression Limits */}
          <div className="lg:col-span-5 space-y-4">
            {/* Compression Limit Sliders */}
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

            {/* Live Preview Box */}
            <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-navy">
                  Live Formatted Output
                </span>
                {result && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy text-white">
                    {result.sizeKb} KB
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[220px]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Formatted Passport Photo"
                    className="max-h-60 rounded shadow-card border border-gray-300 object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-400">Rendering preview...</div>
                )}
              </div>

              {/* Status Message */}
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

              {/* Download CTA */}
              <DownloadButton
                blob={result?.blob || null}
                filename={`${selectedPreset?.shortCode || 'photo'}_passport_ready.jpg`}
                statType="photo"
                savedBytes={Math.max(0, (originalSizeKb - (result?.sizeKb || 0)) * 1024)}
                label="Download Exam-Ready JPG"
              />

              <p className="text-[10px] text-gray-400">
                Guaranteed JPEG format compatible with SSC, UPSC, and state government portals.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
