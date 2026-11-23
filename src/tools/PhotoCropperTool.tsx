import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { CanvasCropper } from '../components/editor/CanvasCropper';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { loadImage, processImageToCanvas, CropRect } from '../utils/imageProcessing';
import { canvasToBlob } from '../utils/compression';
import { Crop, RotateCcw } from 'lucide-react';

export const PhotoCropperTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const [aspectChoice, setAspectChoice] = useState<'free' | '1:1' | 'passport' | 'signature'>('passport');
  const [cropRect, setCropRect] = useState<CropRect>({ x: 0, y: 0, width: 100, height: 100 });

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setOriginalFile(file);
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (e: any) {
      alert(e.message || 'Failed to load image.');
    }
  };

  const getAspectNumeric = () => {
    switch (aspectChoice) {
      case '1:1':
        return 1;
      case 'passport':
        return 3.5 / 4.5;
      case 'signature':
        return 4.0 / 2.0;
      default:
        return undefined;
    }
  };

  useEffect(() => {
    if (!sourceImage) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const targetW = cropRect.width;
        const targetH = cropRect.height;
        const canvas = processImageToCanvas(sourceImage, cropRect, targetW, targetH);
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);

        if (isMounted) {
          setResultBlob(blob);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
        }
      } catch (e) {
        // ignore
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [sourceImage, cropRect]);

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSourceImage(null);
    setOriginalFile(null);
    setResultBlob(null);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Online Photo Cropper for Exam Applications"
        description="Crop photographs and signatures to custom proportions with aspect ratio lock for government exams. Free & private."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <Crop className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Photo Cropper & Frame Aligner
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Lock crop frames to 3.5:4.5 (Passport), 4:2 (Signature), 1:1 (Square), or freeform touch adjustment.
        </p>
      </div>

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Photo to Crop"
            subLabel="JPG, PNG, WEBP"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              {/* Aspect Ratio Presets */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setAspectChoice('passport')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                    aspectChoice === 'passport'
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  3.5 : 4.5 (Passport)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectChoice('signature')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                    aspectChoice === 'signature'
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  4.0 : 2.0 (Signature)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectChoice('1:1')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                    aspectChoice === '1:1'
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  1 : 1 (Square)
                </button>
                <button
                  type="button"
                  onClick={() => setAspectChoice('free')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                    aspectChoice === 'free'
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Freeform
                </button>
              </div>

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
              aspectRatio={getAspectNumeric()}
              lockAspect={aspectChoice !== 'free'}
              showFaceGuide={aspectChoice === 'passport'}
              onCropChange={setCropRect}
            />
          </div>

          <div className="md:col-span-4 bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy block text-left">
              Crop Output
            </span>

            <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[180px]">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Cropped Result"
                  className="max-h-56 rounded shadow-card object-contain"
                />
              )}
            </div>

            <div className="bg-brand-lightBg p-3 rounded-xl text-xs text-gray-600 flex justify-between font-mono">
              <span>Resolution:</span>
              <span className="font-bold text-navy">{cropRect.width} × {cropRect.height} px</span>
            </div>

            <DownloadButton
              blob={resultBlob}
              filename={`${originalFile?.name.replace(/\.[^/.]+$/, '') || 'photo'}_cropped.jpg`}
              statType="photo"
              label="Download Cropped Image"
            />
          </div>
        </div>
      )}
    </div>
  );
};
