import React from 'react';
import { Download, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';

interface MobileStickyActionBarProps {
  currentSizeKb: number | null;
  targetRangeLabel?: string; // e.g. "20 – 50 KB"
  onDownload: () => void;
  onReset?: () => void;
  isDownloadDisabled?: boolean;
  downloadLabel?: string;
  isWithinTarget?: boolean;
  mimeLabel?: string;
}

export const MobileStickyActionBar: React.FC<MobileStickyActionBarProps> = ({
  currentSizeKb,
  targetRangeLabel,
  onDownload,
  onReset,
  isDownloadDisabled = false,
  downloadLabel = 'Download',
  isWithinTarget = true,
  mimeLabel = 'JPG'
}) => {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3.5 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-all animate-in slide-in-from-bottom"
      style={{ paddingBottom: 'calc(0.625rem + env(safe-area-inset-bottom, 0px))' }}
      role="region"
      aria-label="Mobile Document Actions"
    >
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left: Size & Target Status */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            {currentSizeKb !== null ? (
              <span
                className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  isWithinTarget
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isWithinTarget ? (
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                )}
                {currentSizeKb} KB
              </span>
            ) : (
              <span className="text-xs text-gray-400 font-mono">-- KB</span>
            )}
            <span className="text-[10px] uppercase font-semibold text-gray-500">{mimeLabel}</span>
          </div>

          {targetRangeLabel && (
            <span className="text-[10px] text-gray-500 font-medium truncate mt-0.5" title={`Target: ${targetRangeLabel}`}>
              Target: <strong className="text-gray-700">{targetRangeLabel}</strong>
            </span>
          )}
        </div>

        {/* Right: Reset & Download Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 active:scale-95 transition"
              title="Reset Editor"
              aria-label="Reset Document Editor"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
          )}

          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloadDisabled}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition ${
              isDownloadDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-navy hover:bg-navy-800 text-white shadow-elevated'
            }`}
            aria-label={downloadLabel}
          >
            <Download className="w-3.5 h-3.5 text-saffron" />
            <span>{downloadLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
