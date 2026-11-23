import React, { useState } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { incrementUsageStat } from '../../utils/storage';

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  disabled?: boolean;
  statType?: 'photo' | 'signature' | 'pdf';
  savedBytes?: number;
  label?: string;
  className?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  blob,
  filename,
  disabled = false,
  statType = 'photo',
  savedBytes = 0,
  label = 'Download Exam-Ready Document',
  className = ''
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!blob || disabled) return;

    // Create temporary download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    // Increment anonymous stats
    incrementUsageStat(statType, savedBytes);

    // Celebration feedback
    setDownloaded(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF9933', '#2563EB', '#14213D']
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => setDownloaded(false), 3000);
  };

  const sizeKb = blob ? Number((blob.size / 1024).toFixed(1)) : null;
  const mimeLabel = blob ? (blob.type.includes('pdf') ? 'PDF' : 'JPEG') : '';

  return (
    <div className="space-y-1.5 w-full">
      <button
        type="button"
        onClick={handleDownload}
        disabled={!blob || disabled}
        className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-subtle active:scale-[0.99] ${
          !blob || disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : downloaded
            ? 'bg-emerald-600 text-white'
            : 'bg-navy hover:bg-navy-800 text-white shadow-elevated'
        } ${className}`}
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4 text-white" />
            <span>Downloaded to Device!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-saffron" />
            <span>{label}</span>
            {sizeKb !== null && (
              <span className="font-mono text-xs opacity-85 ml-1">
                ({sizeKb} KB {mimeLabel})
              </span>
            )}
          </>
        )}
      </button>

      {blob && (
        <div className="flex items-center justify-between text-[11px] text-gray-500 px-1 font-mono">
          <span className="truncate max-w-[200px]" title={filename}>{filename}</span>
          <span className="text-emerald-700 font-bold">{sizeKb} KB • {mimeLabel}</span>
        </div>
      )}
    </div>
  );
};
