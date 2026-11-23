import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { CanvasCropper } from '../components/editor/CanvasCropper';
import { SignatureControls } from '../components/editor/SignatureControls';
import { CompressionControls } from '../components/editor/CompressionControls';
import { DownloadButton } from '../components/common/DownloadButton';
import { MobileStickyActionBar } from '../components/common/MobileStickyActionBar';
import { SEOHead } from '../components/common/SEOHead';
import { DimensionControls } from '../components/editor/DimensionControls';
import { loadImage, processImageToCanvas, CropRect, ImageAdjustments } from '../utils/imageProcessing';
import { compressCanvasToTarget, CompressionResult } from '../utils/compression';
import { Fingerprint, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';

export const ThumbImpressionTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);

  const [widthPx, setWidthPx] = useState<number>(240);
  const [heightPx, setHeightPx] = useState<number>(240);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    whiteBackgroundClean: true,
    cleanThreshold: 200,
    contrast: 40,
    brightness: 5,
    grayscale: false
  });

  const [minKb, setMinKb] = useState<number>(10);
  const [maxKb, setMaxKb] = useState<number>(20);

  const [result, setResult] = useState<CompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setOriginalFile(file);
      setOriginalSizeKb(Number((file.size / 1024).toFixed(1)));
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (e: any) {
      alert(e.message || 'Failed to load image.');
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
      } catch (e) {
        // ignore
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

  const handleDownloadTrigger = () => {
    if (!result?.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'thumb_impression_ready.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 space-y-6">
      <SEOHead
        title="Thumb Impression Resizer (LTI) - 10KB to 20KB for Banking & Govt Exams"
        description="Format and resize Left Thumb Impression (LTI) for IBPS, SBI, NTA NEET, JEE and Railway exams. Clean ink ridges, whiten paper, and compress to target KB."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <Fingerprint className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Thumb Impression Resizer (LTI)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Crop and enhance Left Thumb Impression (LTI) with crisp ridge lines, white paper background, and 10KB–20KB compression.
        </p>
      </div>

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            sampleType="thumb"
            label="Upload Thumb Impression (LTI)"
            subLabel="Capture clear blue or black ink impression on white unruled paper"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-border p-4 sm:p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">
                Step 1: Crop Thumbprint Center
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
              aspectRatio={widthPx / heightPx}
              lockAspect={lockAspect}
              showFaceGuide={false}
              onCropChange={setCropRect}
            />

            <DimensionControls
              widthPx={widthPx}
              heightPx={heightPx}
              toolType="thumb"
              lockAspectDefault={lockAspect}
              onLockAspectChange={setLockAspect}
              onChange={(w, h) => {
                setWidthPx(w);
                setHeightPx(h);
              }}
            />

            <SignatureControls
              adjustments={adjustments}
              onChange={setAdjustments}
              isThumbImpression={true}
            />
          </div>

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
                  Output Thumb Impression
                </span>
                {result && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-navy text-white">
                    {result.sizeKb} KB
                  </span>
                )}
              </div>

              <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[160px]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Processed Thumb Impression"
                    className="max-h-40 rounded shadow-xs border border-gray-300 bg-white object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-400">Rendering thumbprint...</div>
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
                filename="thumb_impression_ready.jpg"
                statType="photo"
                label="Download Exam-Ready Thumbprint"
              />
            </div>
          </div>
        </div>
      )}

      {sourceImage && result && (
        <MobileStickyActionBar
          currentSizeKb={result.sizeKb}
          targetRangeLabel={`${minKb} – ${maxKb} KB`}
          onDownload={handleDownloadTrigger}
          onReset={resetAll}
          isDownloadDisabled={!result.blob}
          downloadLabel="Download JPG"
          isWithinTarget={result.isWithinTarget}
          mimeLabel="JPG (300 DPI)"
        />
      )}
    </div>
  );
};
