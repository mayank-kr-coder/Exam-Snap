import React, { useState, useRef } from 'react';
import { Columns, SplitSquareVertical, Eye, ZoomIn } from 'lucide-react';

interface BeforeAfterViewerProps {
  originalUrl: string;
  processedUrl: string;
  originalSizeKb?: number;
  processedSizeKb?: number;
  title?: string;
  className?: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  originalUrl,
  processedUrl,
  originalSizeKb,
  processedSizeKb,
  title = 'Quality Comparison',
  className = ''
}) => {
  const [mode, setMode] = useState<'slider' | 'side-by-side' | 'toggle'>('slider');
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [showOriginalInToggle, setShowOriginalInToggle] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    updateSlider(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const savingsPct =
    originalSizeKb && processedSizeKb && originalSizeKb > 0
      ? Math.round(((originalSizeKb - processedSizeKb) / originalSizeKb) * 100)
      : null;

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-4 shadow-subtle space-y-3 ${className}`}>
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-navy" />
          <span className="text-xs font-bold text-navy">{title}</span>
          {savingsPct !== null && savingsPct > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {savingsPct}% Smaller
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[11px] font-medium text-gray-600">
          <button
            type="button"
            onClick={() => setMode('slider')}
            className={`px-2 py-1 rounded-md transition ${
              mode === 'slider' ? 'bg-white text-navy font-bold shadow-xs' : 'hover:text-navy'
            }`}
          >
            Split Slider
          </button>
          <button
            type="button"
            onClick={() => setMode('side-by-side')}
            className={`px-2 py-1 rounded-md transition ${
              mode === 'side-by-side' ? 'bg-white text-navy font-bold shadow-xs' : 'hover:text-navy'
            }`}
          >
            Side by Side
          </button>
          <button
            type="button"
            onClick={() => setMode('toggle')}
            className={`px-2 py-1 rounded-md transition ${
              mode === 'toggle' ? 'bg-white text-navy font-bold shadow-xs' : 'hover:text-navy'
            }`}
          >
            Tap to Compare
          </button>
        </div>
      </div>

      {/* Mode 1: Split Slider */}
      {mode === 'slider' && (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-gray-900 select-none cursor-ew-resize touch-none flex items-center justify-center border border-gray-200"
        >
          {/* Processed (After) on the right/base */}
          <img
            src={processedUrl}
            alt="Processed"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Original (Before) clipped by slider */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain max-w-none"
              style={{
                width: containerRef.current?.clientWidth || '100%',
                height: containerRef.current?.clientHeight || '100%'
              }}
            />
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-navy border-2 border-white flex items-center justify-center text-white shadow-md">
              <span className="text-[10px] font-bold select-none">↔</span>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none">
            Original {originalSizeKb ? `(${originalSizeKb} KB)` : ''}
          </div>
          <div className="absolute top-2 right-2 bg-saffron text-navy text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none">
            Exam Ready {processedSizeKb ? `(${processedSizeKb} KB)` : ''}
          </div>
        </div>
      )}

      {/* Mode 2: Side by Side */}
      {mode === 'side-by-side' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1 text-center">
            <div className="h-56 sm:h-72 rounded-xl bg-gray-950 flex items-center justify-center overflow-hidden p-2 border border-gray-200">
              <img src={originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-between text-[11px] px-1 text-gray-600">
              <span className="font-semibold">Original Upload</span>
              {originalSizeKb && <span className="font-mono text-gray-500">{originalSizeKb} KB</span>}
            </div>
          </div>

          <div className="space-y-1 text-center">
            <div className="h-56 sm:h-72 rounded-xl bg-gray-950 flex items-center justify-center overflow-hidden p-2 border border-saffron/40 shadow-xs">
              <img src={processedUrl} alt="Processed" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="font-bold text-navy">Exam Ready Result</span>
              {processedSizeKb && (
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                  {processedSizeKb} KB
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Tap / Press to Compare */}
      {mode === 'toggle' && (
        <div className="space-y-2 text-center">
          <div className="relative h-64 sm:h-80 rounded-xl bg-gray-950 flex items-center justify-center overflow-hidden p-2 border border-gray-200">
            <img
              src={showOriginalInToggle ? originalUrl : processedUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm bg-black/75">
              Viewing: {showOriginalInToggle ? 'Original' : 'Processed (Exam Ready)'}
            </div>
          </div>

          <button
            type="button"
            onMouseDown={() => setShowOriginalInToggle(true)}
            onMouseUp={() => setShowOriginalInToggle(false)}
            onTouchStart={() => setShowOriginalInToggle(true)}
            onTouchEnd={() => setShowOriginalInToggle(false)}
            className="w-full py-2 px-4 rounded-xl border border-navy/30 bg-navy/5 hover:bg-navy/10 text-navy font-bold text-xs transition active:scale-98 select-none"
          >
            Hold Down to View Original
          </button>
        </div>
      )}

      {/* Footer Details */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
        <span>Clean background, sharp edges & optimized size</span>
        <span className="font-mono">100% In-Browser Inspection</span>
      </div>
    </div>
  );
};
