import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { DateStampControls } from '../components/editor/DateStampControls';
import { DownloadButton } from '../components/common/DownloadButton';
import { SEOHead } from '../components/common/SEOHead';
import { loadImage, processImageToCanvas, StampOptions, CropRect } from '../utils/imageProcessing';
import { canvasToBlob } from '../utils/compression';
import { Calendar, RotateCcw, AlertCircle } from 'lucide-react';

export const DateStampTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const [stamp, setStamp] = useState<StampOptions>({
    enabled: true,
    name: 'CANDIDATE NAME',
    date: 'DOP: ' + new Date().toLocaleDateString('en-GB'),
    position: 'bottom',
    fontSize: 16
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
          fillColor: '#FFFFFF',
          stamp
        });

        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
        if (isMounted) {
          setPreviewBlob(blob);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(URL.createObjectURL(blob));
        }
      } catch (e) {
        // ignore
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [sourceImage, stamp]);

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
        title="Date and Name Stamp on Photo for Govt Exams (SSC, UPSSSC, UPSC)"
        description="Add candidate name and Date of Photograph (DOP) printed at the bottom of your passport photo according to official government recruitment guidelines."
      />

      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-navy text-saffron">
            <Calendar className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
            Date & Name Stamp Tool
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Add printed Candidate Name and Date of Photo (DOP) on a crisp white bottom banner as required by SSC, UPSSSC, and state exam notices.
        </p>
      </div>

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto py-8">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Passport Photo for Stamping"
            subLabel="JPG, PNG, WEBP"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-navy">
                Stamp Options
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

            <DateStampControls
              stamp={stamp}
              onChange={setStamp}
            />

            <DownloadButton
              blob={previewBlob}
              filename={`${originalFile?.name.replace(/\.[^/.]+$/, '') || 'photo'}_stamped.jpg`}
              statType="photo"
              label="Download Stamped Photo (JPG)"
            />
          </div>

          <div className="md:col-span-7 bg-white rounded-2xl border border-brand-border p-5 shadow-subtle space-y-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy block text-left">
              Stamp Preview
            </span>

            <div className="flex justify-center items-center bg-brand-lightBg p-4 rounded-xl border border-gray-200 min-h-[300px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Stamped Photo Preview"
                  className="max-h-80 rounded shadow-card object-contain"
                />
              ) : (
                <div className="text-xs text-gray-400">Rendering stamp...</div>
              )}
            </div>

            <p className="text-[11px] text-gray-500">
              Note: Only use this tool if your specific exam notification explicitly asks for Date of Photograph (DOP) or Candidate Name.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
