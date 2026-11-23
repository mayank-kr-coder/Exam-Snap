import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Plus, Minus, Maximize2, Sparkles } from 'lucide-react';

export interface DimensionControlsProps {
  widthPx: number;
  heightPx: number;
  onChange: (width: number, height: number) => void;
  toolType?: 'signature' | 'photo' | 'thumb' | 'general';
  lockAspectDefault?: boolean;
  onLockAspectChange?: (locked: boolean) => void;
}

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  widthPx,
  heightPx,
  onChange,
  toolType = 'signature',
  lockAspectDefault = true,
  onLockAspectChange
}) => {
  const [locked, setLocked] = useState<boolean>(lockAspectDefault);
  const [widthInput, setWidthInput] = useState<string>(String(widthPx));
  const [heightInput, setHeightInput] = useState<string>(String(heightPx));

  useEffect(() => {
    setWidthInput(String(widthPx));
  }, [widthPx]);

  useEffect(() => {
    setHeightInput(String(heightPx));
  }, [heightPx]);

  const toggleLock = () => {
    const nextLocked = !locked;
    setLocked(nextLocked);
    if (onLockAspectChange) {
      onLockAspectChange(nextLocked);
    }
  };

  const handleWidthChange = (valStr: string) => {
    setWidthInput(valStr);
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const newWidth = Math.max(30, Math.min(4000, parsed));
      if (locked && widthPx > 0) {
        const ratio = heightPx / widthPx;
        const newHeight = Math.max(20, Math.round(newWidth * ratio));
        onChange(newWidth, newHeight);
      } else {
        onChange(newWidth, heightPx);
      }
    }
  };

  const handleHeightChange = (valStr: string) => {
    setHeightInput(valStr);
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed > 0) {
      const newHeight = Math.max(20, Math.min(4000, parsed));
      if (locked && heightPx > 0) {
        const ratio = widthPx / heightPx;
        const newWidth = Math.max(30, Math.round(newHeight * ratio));
        onChange(newWidth, newHeight);
      } else {
        onChange(widthPx, newHeight);
      }
    }
  };

  const adjustWidth = (delta: number) => {
    const currentW = Math.max(30, widthPx);
    const newW = Math.max(30, Math.min(4000, currentW + delta));
    if (locked && currentW > 0) {
      const ratio = heightPx / currentW;
      const newH = Math.max(20, Math.round(newW * ratio));
      onChange(newW, newH);
    } else {
      onChange(newW, heightPx);
    }
  };

  const adjustHeight = (delta: number) => {
    const currentH = Math.max(20, heightPx);
    const newH = Math.max(20, Math.min(4000, currentH + delta));
    if (locked && currentH > 0) {
      const ratio = widthPx / currentH;
      const newW = Math.max(30, Math.round(newH * ratio));
      onChange(newW, newH);
    } else {
      onChange(widthPx, newH);
    }
  };

  const scaleBoth = (factor: number) => {
    const newW = Math.max(30, Math.min(4000, Math.round(widthPx * factor)));
    const newH = Math.max(20, Math.min(4000, Math.round(heightPx * factor)));
    onChange(newW, newH);
  };

  const currentRatio = heightPx > 0 ? (widthPx / heightPx).toFixed(2) : '1.00';

  // Dimension presets by tool
  const signaturePresets = [
    { label: '140 × 60 px', desc: 'SSC / Standard', w: 140, h: 60 },
    { label: '200 × 230 px', desc: 'IBPS / Bank', w: 200, h: 230 },
    { label: '350 × 150 px', desc: 'UPSC / State PSC', w: 350, h: 150 },
    { label: '500 × 200 px', desc: 'HQ Large', w: 500, h: 200 }
  ];

  const photoPresets = [
    { label: '413 × 531 px', desc: '3.5×4.5 cm (SSC/UPSC)', w: 413, h: 531 },
    { label: '350 × 450 px', desc: 'Standard Passport', w: 350, h: 450 },
    { label: '200 × 230 px', desc: 'Banking (IBPS)', w: 200, h: 230 },
    { label: '600 × 600 px', desc: '2×2 inch Square', w: 600, h: 600 }
  ];

  const thumbPresets = [
    { label: '240 × 240 px', desc: '1:1 Square', w: 240, h: 240 },
    { label: '200 × 230 px', desc: 'Banking (IBPS)', w: 200, h: 230 },
    { label: '140 × 60 px', desc: 'Horizontal', w: 140, h: 60 }
  ];

  const activePresets = 
    toolType === 'signature' ? signaturePresets :
    toolType === 'thumb' ? thumbPresets :
    photoPresets;

  return (
    <div className="bg-brand-lightBg p-4 rounded-xl border border-gray-200 space-y-3">
      {/* Header with Title and Aspect Lock Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-navy" />
          <span className="text-xs font-bold text-navy">
            Target Output Dimensions
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            ({widthPx} × {heightPx} px)
          </span>
        </div>

        <button
          type="button"
          onClick={toggleLock}
          title={locked ? 'Aspect ratio is locked. Click to unlock.' : 'Aspect ratio is free. Click to lock.'}
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border transition ${
            locked
              ? 'bg-navy/10 text-navy border-navy/30 hover:bg-navy/15'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
          }`}
        >
          {locked ? (
            <>
              <Lock className="w-3 h-3 text-navy" />
              <span>Lock Ratio ({currentRatio}:1)</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3 text-gray-500" />
              <span>Free Ratio</span>
            </>
          )}
        </button>
      </div>

      {/* Width and Height Controls with Stepper Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Width (px) */}
        <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-gray-700">Width (px)</label>
            <span className="text-[10px] text-gray-400 font-mono">{widthPx} px</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => adjustWidth(-10)}
              title="Decrease width by 10px"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold active:scale-95 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min={30}
              max={4000}
              value={widthInput}
              onChange={(e) => handleWidthChange(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1.5 text-center text-xs font-mono font-bold text-navy border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            />
            <button
              type="button"
              onClick={() => adjustWidth(10)}
              title="Increase width by 10px"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-navy hover:bg-navy-800 text-white font-bold active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 gap-1">
            <button
              type="button"
              onClick={() => adjustWidth(-50)}
              className="text-[10px] font-semibold text-gray-500 hover:text-navy bg-gray-50 hover:bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
            >
              -50px
            </button>
            <button
              type="button"
              onClick={() => adjustWidth(50)}
              className="text-[10px] font-semibold text-navy bg-saffron/15 hover:bg-saffron/25 px-1.5 py-0.5 rounded border border-saffron/40"
            >
              +50px
            </button>
            <button
              type="button"
              onClick={() => adjustWidth(100)}
              className="text-[10px] font-semibold text-navy bg-saffron/20 hover:bg-saffron/30 px-1.5 py-0.5 rounded border border-saffron/50"
            >
              +100px
            </button>
          </div>
        </div>

        {/* Height (px) */}
        <div className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-gray-700">Height (px)</label>
            <span className="text-[10px] text-gray-400 font-mono">{heightPx} px</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => adjustHeight(-10)}
              title="Decrease height by 10px"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold active:scale-95 transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min={20}
              max={4000}
              value={heightInput}
              onChange={(e) => handleHeightChange(e.target.value)}
              className="flex-1 min-w-0 px-2 py-1.5 text-center text-xs font-mono font-bold text-navy border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
            />
            <button
              type="button"
              onClick={() => adjustHeight(10)}
              title="Increase height by 10px"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-navy hover:bg-navy-800 text-white font-bold active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-1.5 gap-1">
            <button
              type="button"
              onClick={() => adjustHeight(-50)}
              className="text-[10px] font-semibold text-gray-500 hover:text-navy bg-gray-50 hover:bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200"
            >
              -50px
            </button>
            <button
              type="button"
              onClick={() => adjustHeight(50)}
              className="text-[10px] font-semibold text-navy bg-saffron/15 hover:bg-saffron/25 px-1.5 py-0.5 rounded border border-saffron/40"
            >
              +50px
            </button>
            <button
              type="button"
              onClick={() => adjustHeight(100)}
              className="text-[10px] font-semibold text-navy bg-saffron/20 hover:bg-saffron/30 px-1.5 py-0.5 rounded border border-saffron/50"
            >
              +100px
            </button>
          </div>
        </div>
      </div>

      {/* Quick Scale Multipliers */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-gray-200/80">
        <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-saffron-dark" />
          Quick Resize:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => scaleBoth(0.8)}
            className="text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-md transition active:scale-95"
            title="Shrink dimensions by 20%"
          >
            -20%
          </button>
          <button
            type="button"
            onClick={() => scaleBoth(1.2)}
            className="text-[11px] font-bold text-navy bg-white hover:bg-saffron/15 border border-saffron/40 px-2 py-0.5 rounded-md transition active:scale-95"
            title="Increase dimensions by 20%"
          >
            +20%
          </button>
          <button
            type="button"
            onClick={() => scaleBoth(1.5)}
            className="text-[11px] font-bold text-navy bg-white hover:bg-saffron/25 border border-saffron/50 px-2 py-0.5 rounded-md transition active:scale-95"
            title="Increase dimensions by 50%"
          >
            +50% (1.5×)
          </button>
          <button
            type="button"
            onClick={() => scaleBoth(2.0)}
            className="text-[11px] font-bold text-white bg-navy hover:bg-navy-800 px-2.5 py-0.5 rounded-md shadow-xs transition active:scale-95"
            title="Double resolution (2x)"
          >
            2× Double
          </button>
        </div>
      </div>

      {/* Common Exam Standard Dimension Chips */}
      <div className="pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
          Common Exam Dimensions (1-Click Apply)
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {activePresets.map((p) => {
            const isMatch = widthPx === p.w && heightPx === p.h;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange(p.w, p.h)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition active:scale-95 ${
                  isMatch
                    ? 'bg-navy text-white border-navy font-bold shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-navy hover:text-navy'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[9px] opacity-75 ml-1">({p.desc})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
