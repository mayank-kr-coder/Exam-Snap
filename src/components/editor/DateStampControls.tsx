import React from 'react';
import { StampOptions } from '../../utils/imageProcessing';
import { Calendar, User, Type, AlertCircle } from 'lucide-react';

interface DateStampControlsProps {
  stamp: StampOptions;
  onChange: (stamp: StampOptions) => void;
  requiredByPreset?: boolean;
}

export const DateStampControls: React.FC<DateStampControlsProps> = ({
  stamp,
  onChange,
  requiredByPreset = false
}) => {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          <span className="text-sm font-semibold text-brand-dark">
            Name & Date of Photo (DOP / DOB)
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={stamp.enabled}
            onChange={(e) => onChange({ ...stamp, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-navy"></div>
        </label>
      </div>

      {requiredByPreset && (
        <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/80 rounded-lg p-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Required by current exam:</strong> The notification specifies printing candidate name and date of photo on the photograph.
          </span>
        </div>
      )}

      {stamp.enabled && (
        <div className="space-y-3 pt-1 border-t border-gray-100">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Candidate Full Name (in CAPITAL letters)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={stamp.name || ''}
                placeholder="e.g. RAHUL KUMAR SHARMA"
                onChange={(e) => onChange({ ...stamp, name: e.target.value.toUpperCase() })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date (e.g. DOP or Date of Birth)
              </label>
              <input
                type="text"
                value={stamp.date || ''}
                placeholder="DOP: 15/02/2026"
                onChange={(e) => onChange({ ...stamp, date: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Position & Font Size
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={stamp.position || 'bottom'}
                  onChange={(e) => onChange({ ...stamp, position: e.target.value as any })}
                  className="w-1/2 px-2 py-2 text-xs border border-gray-300 rounded-lg bg-white"
                >
                  <option value="bottom">Bottom Bar</option>
                  <option value="top">Top Bar</option>
                </select>
                <div className="flex items-center gap-1 w-1/2">
                  <Type className="w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="range"
                    min="10"
                    max="28"
                    value={stamp.fontSize || 14}
                    onChange={(e) => onChange({ ...stamp, fontSize: Number(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
