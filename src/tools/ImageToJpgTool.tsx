import React, { useState } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { loadImage } from '../utils/imageProcessing';
import { canvasToBlob } from '../utils/compression';
import { RefreshCw, RotateCcw, CheckCircle2 } from 'lucide-react';

export const ImageToJpgTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.92);

  const handleFileSelect = async (file: File) => {
    try {
      setOriginalFile(file);
      const img = await loadImage(file);
      setSourceImage(img);

      // Render to canvas with white background (in case of transparent PNG)
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
        setConvertedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      }
    } catch (e: any) {
      alert(e.message || 'Failed to process image');
    }
  };

  const handleQualityChange = async (newQuality: number) => {
    setQuality(newQuality);
    if (!sourceImage) return;
    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth || sourceImage.width;
    canvas.height = sourceImage.naturalHeight || sourceImage.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(sourceImage, 0, 0);
      const blob = await canvasToBlob(canvas, 'image/jpeg', newQuality);
      setConvertedBlob(blob);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
    }
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSourceImage(null);
    setOriginalFile(null);
    setConvertedBlob(null);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Image to JPG Converter (PNG, WebP to JPEG for Govt Portals)"
        description="Convert PNG, WebP and other image formats to standard JPG format required by SSC, UPSC, and Indian government application forms."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <RefreshCw className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Image to JPG Converter
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Government examination portals strictly require .jpg or .jpeg. Convert transparent PNGs, screenshots, or WebPs with a clean white background.
        </p>
      </div>

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload PNG, WebP or Image"
            subLabel="Supports PNG, WebP, JPEG up to 15MB"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-navy">
              Converted Output (Pure JPEG)
            </span>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Convert Another File
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[220px]">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Converted JPG"
                  className="max-h-64 rounded shadow-card object-contain"
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-brand-lightBg p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Original Format:</span>
                  <span className="font-mono font-bold text-gray-700 uppercase">
                    {originalFile?.name.split('.').pop() || 'IMG'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Output Format:</span>
                  <span className="font-mono font-bold text-navy">image/jpeg (.jpg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Output Size:</span>
                  <span className="font-mono font-bold text-navy">
                    {convertedBlob ? `${(convertedBlob.size / 1024).toFixed(1)} KB` : '...'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  JPEG Export Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                />
              </div>

              <DownloadButton
                blob={convertedBlob}
                filename={`${originalFile?.name.replace(/\.[^/.]+$/, '') || 'document'}_converted.jpg`}
                statType="photo"
                label="Download JPG"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
