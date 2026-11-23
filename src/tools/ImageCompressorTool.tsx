import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { loadImage } from '../utils/imageProcessing';
import { compressCanvasToTarget, canvasToBlob, CompressionResult } from '../utils/compression';
import { 
  Minimize2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0);

  // Target KB mode vs manual slider quality
  const [mode, setMode] = useState<'target' | 'manual'>('target');
  const [targetKb, setTargetKb] = useState<number>(50);
  const [manualQuality, setManualQuality] = useState<number>(0.8);

  const [result, setResult] = useState<CompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setOriginalFile(file);
      setOriginalSizeKb(Number((file.size / 1024).toFixed(1)));
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (err: any) {
      alert(err.message || 'Failed to load image.');
    }
  };

  useEffect(() => {
    if (!sourceImage) return;

    let isMounted = true;
    setIsProcessing(true);

    const timer = setTimeout(async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = sourceImage.naturalWidth || sourceImage.width;
        canvas.height = sourceImage.naturalHeight || sourceImage.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(sourceImage, 0, 0);

        let compResult: CompressionResult;

        if (mode === 'target') {
          // Strict binary search compression to reach target KB
          const minRange = Math.max(5, targetKb - 5);
          const maxRange = targetKb;
          compResult = await compressCanvasToTarget(canvas, minRange, maxRange, {
            allowDownscaleIfTooLarge: true
          });
        } else {
          // Manual quality factor
          const blob = await canvasToBlob(canvas, 'image/jpeg', manualQuality);
          const sizeKb = Number((blob.size / 1024).toFixed(1));
          compResult = {
            blob,
            sizeBytes: blob.size,
            sizeKb,
            quality: manualQuality,
            width: canvas.width,
            height: canvas.height,
            isWithinTarget: true,
            achievedTarget: true,
            message: `Compressed at ${Math.round(manualQuality * 100)}% quality (${sizeKb} KB)`
          };
        }

        if (isMounted) {
          setResult(compResult);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          const newUrl = URL.createObjectURL(compResult.blob);
          setPreviewUrl(newUrl);
          setIsProcessing(false);
        }
      } catch (e) {
        if (isMounted) setIsProcessing(false);
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [sourceImage, mode, targetKb, manualQuality]);

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSourceImage(null);
    setOriginalFile(null);
    setResult(null);
    setPreviewUrl(null);
  };

  const compressionPercent = originalSizeKb > 0 && result
    ? Math.max(0, Math.round(((originalSizeKb - result.sizeKb) / originalSizeKb) * 100))
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Govt Exam Photo Compressor (Compress to 20KB, 50KB, 100KB)"
        description="Iterative client-side photo compressor for competitive exams. Accurately compress images down to 20KB–50KB without blurring or loss of facial features."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <Minimize2 className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Photo Compressor (Iterative KB Target)
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Compress photographs to exact portal requirements (e.g. below 50KB or 20KB) with live comparison.
        </p>
      </div>

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Image to Compress"
            subLabel="JPG, PNG, WEBP (Any size up to 15MB)"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Controls */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">
                Compression Settings
              </span>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New Image
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex bg-brand-lightBg p-1 rounded-xl border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setMode('target')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  mode === 'target' ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
                }`}
              >
                Target File Size (KB)
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                  mode === 'manual' ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
                }`}
              >
                Manual Quality
              </button>
            </div>

            {mode === 'target' ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-700">
                  Target Maximum File Size: <span className="font-bold text-navy">{targetKb} KB</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[20, 50, 100, 150].map((presetKb) => (
                    <button
                      key={presetKb}
                      type="button"
                      onClick={() => setTargetKb(presetKb)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        targetKb === presetKb
                          ? 'bg-navy text-white border-navy font-semibold'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {presetKb} KB {presetKb === 50 ? '(SSC / UPSC)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-gray-700">JPEG Quality Factor</span>
                  <span className="font-mono font-bold text-navy">{Math.round(manualQuality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={manualQuality}
                  onChange={(e) => setManualQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                />
              </div>
            )}

            {/* Comparison Metrics */}
            <div className="bg-brand-lightBg p-4 rounded-xl border border-gray-100 space-y-2 text-xs">
              <span className="font-semibold text-gray-600 block">File Size Comparison</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-500">Original Size:</span>
                <span className="font-mono font-medium text-gray-700">{originalSizeKb} KB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Compressed Size:</span>
                <span className="font-mono font-bold text-navy">{result?.sizeKb || 0} KB</span>
              </div>
              {compressionPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold pt-1 border-t border-gray-200">
                  <span>Space Saved:</span>
                  <span>{compressionPercent}% smaller</span>
                </div>
              )}
            </div>

            <DownloadButton
              blob={result?.blob || null}
              filename={`${originalFile?.name.replace(/\.[^/.]+$/, '') || 'photo'}_compressed.jpg`}
              statType="photo"
              savedBytes={Math.max(0, (originalSizeKb - (result?.sizeKb || 0)) * 1024)}
              label="Download Compressed JPG"
            />
          </div>

          {/* Live Preview Display */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy block text-left">
              Real-Time Visual Preview
            </span>

            <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[300px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Compressed Preview"
                  className="max-h-80 rounded shadow-card object-contain"
                />
              ) : (
                <div className="text-xs text-gray-400">Processing compression...</div>
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
          </div>
        </div>
      )}
    </div>
  );
};
