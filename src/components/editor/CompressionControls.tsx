import React from 'react';
import { SlidersHorizontal, HardDrive, CheckCircle2, AlertTriangle } from 'lucide-react';

interface CompressionControlsProps {
  minKb: number;
  maxKb: number;
  onChangeRange: (minKb: number, maxKb: number) => void;
  currentSizeKb?: number;
  originalSizeKb?: number;
  isWithinTarget?: boolean;
}

export const CompressionControls: React.FC<CompressionControlsProps> = ({
  minKb,
  maxKb,
  onChangeRange,
  currentSizeKb,
  originalSizeKb,
  isWithinTarget
}) => {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-brand-blue" />
          <span className="text-sm font-semibold text-brand-dark">
            File Size Limits (KB)
          </span>
        </div>
        <span className="text-xs font-mono font-medium bg-brand-lightBg px-2 py-0.5 rounded border border-gray-200">
          Target: {minKb} KB – {maxKb} KB
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Minimum File Size</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="2"
              max={maxKb - 2}
              value={minKb}
              onChange={(e) => onChangeRange(Math.max(1, Number(e.target.value)), maxKb)}
              className="w-full px-2.5 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy"
            />
            <span className="text-xs text-gray-500">KB</span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Maximum File Size</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={minKb + 2}
              max="2048"
              value={maxKb}
              onChange={(e) => onChangeRange(minKb, Math.max(minKb + 1, Number(e.target.value)))}
              className="w-full px-2.5 py-1.5 text-xs font-mono border border-gray-300 rounded-lg focus:ring-1 focus:ring-navy"
            />
            <span className="text-xs text-gray-500">KB</span>
          </div>
        </div>
      </div>

      {currentSizeKb !== undefined && (
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {originalSizeKb && (
              <span className="text-gray-400 line-through">
                {originalSizeKb.toFixed(1)} KB
              </span>
            )}
            <span className="font-semibold text-brand-dark font-mono text-sm">
              {currentSizeKb.toFixed(1)} KB
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isWithinTarget ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium text-[11px] border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Fits Portal Limit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium text-[11px] border border-amber-200">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Adjusting
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
