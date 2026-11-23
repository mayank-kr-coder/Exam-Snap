import React from 'react';
import { ImageAdjustments } from '../../utils/imageProcessing';
import { Paintbrush, Info } from 'lucide-react';

interface BackgroundControlsProps {
  adjustments: ImageAdjustments;
  onChange: (adjustments: ImageAdjustments) => void;
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  adjustments,
  onChange
}) => {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-4 h-4 text-brand-blue" />
          <span className="text-sm font-semibold text-brand-dark">
            Background Cleanup & Tone
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={adjustments.replaceBackground || false}
            onChange={(e) =>
              onChange({ ...adjustments, replaceBackground: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-navy"></div>
        </label>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
        <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span>
          Uses browser-side edge & color threshold sampling. Works best when original photo was taken against a light wall.
        </span>
      </div>

      {adjustments.replaceBackground && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Select Background Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...adjustments, targetBgColor: '#FFFFFF' })}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition ${
                  (adjustments.targetBgColor || '#FFFFFF') === '#FFFFFF'
                    ? 'border-navy bg-navy/5 text-navy font-semibold ring-1 ring-navy'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white shadow-xs"></span>
                <span>Pure White</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...adjustments, targetBgColor: '#F0F4F8' })}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition ${
                  adjustments.targetBgColor === '#F0F4F8'
                    ? 'border-navy bg-navy/5 text-navy font-semibold ring-1 ring-navy'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-[#F0F4F8] shadow-xs"></span>
                <span>Studio Off-White</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...adjustments, targetBgColor: '#E2E8F0' })}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition ${
                  adjustments.targetBgColor === '#E2E8F0'
                    ? 'border-navy bg-navy/5 text-navy font-semibold ring-1 ring-navy'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-[#E2E8F0] shadow-xs"></span>
                <span>Light Grey</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
              <span>Background Detection Tolerance</span>
              <span className="font-mono">{adjustments.bgTolerance || 45}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={adjustments.bgTolerance || 45}
              onChange={(e) =>
                onChange({ ...adjustments, bgTolerance: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
            />
          </div>
        </div>
      )}
    </div>
  );
};
