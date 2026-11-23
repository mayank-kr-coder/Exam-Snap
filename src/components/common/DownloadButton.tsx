import React, { useState } from 'react';
import { Download, Check, Share2, MessageCircle, AlertCircle, ShieldCheck } from 'lucide-react';
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
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const triggerDownload = () => {
    if (!blob || disabled) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 2000);
    incrementUsageStat(statType, savedBytes);

    setDownloaded(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF9933', '#2563EB', '#14213D']
      });
    } catch {
      // ignore
    }

    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleShare = async () => {
    if (!blob || disabled) return;

    const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

    // 1. Try Native Web Share API with file attachment
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: filename,
          text: `Exam Snap Sarkari Doc Prep: Processed ${filename} (${Number((blob.size / 1024).toFixed(1))} KB)`
        });
        setShareNotice('Document shared successfully!');
        setTimeout(() => setShareNotice(null), 3500);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // User closed sheet
      }
    }

    // 2. Fallback: Save file to device first, then offer WhatsApp link
    triggerDownload();
    const shareText = encodeURIComponent(
      `I prepared my exam document ${filename} (${Number((blob.size / 1024).toFixed(1))} KB) using Exam Snap: https://exam-snap-nine.vercel.app`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    setShareNotice('File saved to device! Attach downloaded file in WhatsApp chat.');
    setTimeout(() => setShareNotice(null), 5000);
  };

  const sizeKb = blob ? Number((blob.size / 1024).toFixed(1)) : null;
  const mimeLabel = blob ? (blob.type.includes('pdf') ? 'PDF' : 'JPEG') : '';

  return (
    <div className="space-y-2 w-full">
      {/* Primary Download Button */}
      <button
        type="button"
        onClick={triggerDownload}
        disabled={!blob || disabled}
        className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-subtle active:scale-[0.99] ${
          !blob || disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : downloaded
            ? 'bg-emerald-600 text-white'
            : 'bg-navy hover:bg-navy-800 text-white shadow-elevated'
        } ${className}`}
        aria-label="Download Document"
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

      {/* Secondary Share Button (WhatsApp / Web Share API) */}
      {blob && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={disabled}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center gap-1.5 transition active:scale-98"
            title="Share via WhatsApp or Device Share"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Share / WhatsApp</span>
          </button>
        </div>
      )}

      {shareNotice && (
        <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md p-2 flex items-center gap-1.5 animate-in fade-in">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>{shareNotice}</span>
        </div>
      )}

      {blob && (
        <div className="flex items-center justify-between text-[11px] text-gray-500 px-1 font-mono">
          <span className="truncate max-w-[200px]" title={filename}>{filename}</span>
          <span className="text-emerald-700 font-bold">{sizeKb} KB • {mimeLabel} (300 DPI)</span>
        </div>
      )}
    </div>
  );
};
