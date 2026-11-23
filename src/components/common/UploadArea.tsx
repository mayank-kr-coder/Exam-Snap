import React, { useRef, useState } from 'react';
import { Upload, Camera, ShieldCheck, AlertTriangle, FileText, Sparkles } from 'lucide-react';
import { 
  createSamplePassportPhotoBlob, 
  createSampleSignatureBlob, 
  createSampleThumbprintBlob 
} from '../../utils/sampleImages';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  allowedExtensions?: string[];
  maxSizeMb?: number;
  label?: string;
  subLabel?: string;
  isPdf?: boolean;
  sampleType?: 'photo' | 'signature' | 'thumb';
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelect,
  accept = 'image/jpeg,image/png,image/webp,image/jpg',
  allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'],
  maxSizeMb = 15,
  label = 'Choose file or drag & drop here',
  subLabel = 'Supports JPG, PNG, WEBP (Max 15MB)',
  isPdf = false,
  sampleType = 'photo'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPassFile = (file: File) => {
    setErrorMessage(null);

    const maxSizeBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${maxSizeMb}MB.`);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (isPdf) {
      if (ext !== 'pdf' && file.type !== 'application/pdf') {
        setErrorMessage('Please select a valid PDF document (.pdf)');
        return;
      }
    } else {
      if (!ext || !allowedExtensions.includes(ext)) {
        setErrorMessage(`Invalid file format. Allowed formats: ${allowedExtensions.map((e) => e.toUpperCase()).join(', ')}`);
        return;
      }
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sampleType === 'signature') {
      const sample = await createSampleSignatureBlob();
      validateAndPassFile(sample);
    } else if (sampleType === 'thumb') {
      const sample = await createSampleThumbprintBlob();
      validateAndPassFile(sample);
    } else {
      const sample = await createSamplePassportPhotoBlob();
      validateAndPassFile(sample);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-brand-blue bg-blue-50/50 scale-[1.01]'
            : 'border-gray-300 hover:border-navy bg-white hover:bg-gray-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={isPdf ? 'application/pdf' : accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-brand-lightBg flex items-center justify-center text-navy mb-3 shadow-inner">
          {isPdf ? (
            <FileText className="w-6 h-6 text-brand-blue" />
          ) : (
            <Upload className="w-6 h-6 text-navy" />
          )}
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-brand-dark mb-1">
          {label}
        </h3>
        <p className="text-xs text-gray-500 mb-4">{subLabel}</p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-navy text-white shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            Browse Files
          </span>

          {!isPdf && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Camera className="w-3.5 h-3.5" />
              Camera
            </span>
          )}

          {!isPdf && (
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-saffron/20 hover:bg-saffron/30 text-navy-900 border border-saffron/50 shadow-xs transition"
              title="Test immediately with demo image"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
              <span>Try Demo Sample</span>
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Privacy Guarantee reassurance */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Processed locally on your device. Zero server upload.</span>
      </div>
    </div>
  );
};
