import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { BackgroundControls } from '../components/editor/BackgroundControls';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { loadImage, processImageToCanvas, ImageAdjustments, CropRect } from '../utils/imageProcessing';
import { canvasToBlob } from '../utils/compression';
import { Paintbrush, RotateCcw, Info, Check } from 'lucide-react';

export const BackgroundChangerTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    replaceBackground: true,
    bgTolerance: 45,
    targetBgColor: '#FFFFFF',
    brightness: 0,
    contrast: 10
  });

  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setOriginalFile(file);
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (e: any) {
      alert(e.message || 'Failed to open image.');
    }
  };

  useEffect(() => {
    if (!sourceImage) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const w = sourceImage.naturalWidth || sourceImage.width;
        const h = sourceImage.naturalHeight || sourceImage.height;
        const crop: CropRect = { x: 0, y: 0, width: w, height: h };

        const canvas = processImageToCanvas(sourceImage, crop, w, h, {
          fillColor: adjustments.targetBgColor || '#FFFFFF',
          adjustments
        });

        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
        if (isMounted) {
          setPreviewBlob(blob);
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
  }, [sourceImage, adjustments]);

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSourceImage(null);
    setOriginalFile(null);
    setPreviewBlob(null);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Govt Exam Photo Background Changer (White & Light Background)"
        description="Clean and change passport photo background to plain white or light studio grey to meet government examination photo specifications."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <Paintbrush className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Background Tone & Cleaner
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Replace or normalize background to plain white or light studio tone without uploading your face to external cloud servers.
        </p>
      </div>

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Passport Photo"
            subLabel="JPG, PNG, WEBP (Works best when taken against a relatively plain wall)"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">
                Background Options
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

            <BackgroundControls
              adjustments={adjustments}
              onChange={setAdjustments}
            />

            <DownloadButton
              blob={previewBlob}
              filename={`${originalFile?.name.replace(/\.[^/.]+$/, '') || 'photo'}_white_bg.jpg`}
              statType="photo"
              label="Download White Background JPG"
            />
          </div>

          <div className="md:col-span-7 bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy block text-left">
              Output Preview
            </span>

            <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[300px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Processed Photo with cleaned background"
                  className="max-h-80 rounded shadow-card object-contain"
                />
              ) : (
                <div className="text-xs text-gray-400">Processing...</div>
              )}
            </div>

            <p className="text-[11px] text-gray-500">
              Note: Indian exam portals require a solid white or light off-white background with clear facial boundaries.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
