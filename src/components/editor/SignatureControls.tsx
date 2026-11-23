import React from 'react';
import { ImageAdjustments } from '../../utils/imageProcessing';
import { Sliders, Sparkles, SunMedium } from 'lucide-react';

interface SignatureControlsProps {
  adjustments: ImageAdjustments;
  onChange: (adjustments: ImageAdjustments) => void;
  isThumbImpression?: boolean;
}

export const SignatureControls: React.FC<SignatureControlsProps> = ({
  adjustments,
  onChange,
  isThumbImpression = false
}) => {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron" />
          <span className="text-sm font-semibold text-brand-dark">
            {isThumbImpression ? 'Ink Ridge Clarity & Paper Whitening' : 'Signature Enhancement & Paper Whitening'}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={adjustments.whiteBackgroundClean ?? true}
            onChange={(e) =>
              onChange({ ...adjustments, whiteBackgroundClean: e.target.checked })
            }
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-navy"></div>
        </label>
      </div>

      <p className="text-xs text-gray-500">
        Automatically removes shadows, grey paper tints, and boosts {isThumbImpression ? 'thumbprint ink ridges' : 'pen ink stroke contrast'} for rejection-free uploads.
      </p>

      <div className="space-y-3 pt-2 border-t border-gray-100">
        {/* Paper Cleaning Threshold */}
        {adjustments.whiteBackgroundClean && (
          <div>
            <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
              <span>Paper Whiteness Threshold</span>
              <span className="font-mono text-gray-500">{adjustments.cleanThreshold || 195}</span>
            </div>
            <input
              type="range"
              min="140"
              max="240"
              value={adjustments.cleanThreshold || 195}
              onChange={(e) =>
                onChange({ ...adjustments, cleanThreshold: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
            />
          </div>
        )}

        {/* Contrast */}
        <div>
          <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
            <span>Ink Contrast</span>
            <span className="font-mono text-gray-500">{adjustments.contrast || 0 > 0 ? `+${adjustments.contrast}` : adjustments.contrast || 0}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="100"
            value={adjustments.contrast || 0}
            onChange={(e) =>
              onChange({ ...adjustments, contrast: Number(e.target.value) })
            }
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
          />
        </div>

        {/* Brightness */}
        <div>
          <div className="flex justify-between items-center text-xs text-gray-700 mb-1">
            <span>Overall Brightness</span>
            <span className="font-mono text-gray-500">{adjustments.brightness || 0 > 0 ? `+${adjustments.brightness}` : adjustments.brightness || 0}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.brightness || 0}
            onChange={(e) =>
              onChange({ ...adjustments, brightness: Number(e.target.value) })
            }
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
          />
        </div>

        {/* Grayscale toggle */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-medium text-gray-700">Monochrome / Black & White</span>
          <input
            type="checkbox"
            checked={adjustments.grayscale || false}
            onChange={(e) =>
              onChange({ ...adjustments, grayscale: e.target.checked })
            }
            className="w-4 h-4 accent-navy rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
