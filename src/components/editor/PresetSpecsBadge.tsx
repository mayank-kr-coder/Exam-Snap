import React from 'react';
import { ExamPreset, ExamDocumentSpec } from '../../types/preset';
import { ShieldCheck, AlertCircle, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PresetSpecsBadgeProps {
  preset: ExamPreset | null;
  spec?: ExamDocumentSpec;
  documentType: 'photo' | 'signature' | 'thumb' | 'certificate';
}

export const PresetSpecsBadge: React.FC<PresetSpecsBadgeProps> = ({
  preset,
  spec,
  documentType
}) => {
  if (!preset || !spec) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-3 text-xs text-gray-500 flex items-center justify-between">
        <span>No specific exam preset applied. Standard freeform limits apply.</span>
        <Link to="/presets" className="text-secondary font-medium hover:underline">
          Choose Exam Preset →
        </Link>
      </div>
    );
  }

  const isVerified = preset.status === 'verified';

  return (
    <div className="bg-white rounded-xl border border-brand-border p-4 shadow-subtle space-y-3">
      {/* Preset Title & Verified Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-navy">{preset.name}</span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Specs
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Demo – Verify Notice
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">{preset.organization}</p>
        </div>

        <div className="text-right flex items-center gap-2 text-xs">
          <span className="text-gray-400 flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3" />
            Verified: {preset.lastVerifiedDate}
          </span>
          {preset.sourceUrl && (
            <a
              href={preset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-navy inline-flex items-center gap-0.5 text-[11px] font-medium underline"
            >
              Notice <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Target Requirements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-brand-lightBg p-2 rounded-lg border border-gray-100">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Dimensions</span>
          <span className="font-mono font-semibold text-brand-dark">
            {spec.requiredWidthPx && spec.requiredHeightPx
              ? `${spec.requiredWidthPx} × ${spec.requiredHeightPx} px`
              : `${spec.widthCm} × ${spec.heightCm} cm`}
          </span>
        </div>

        <div className="bg-brand-lightBg p-2 rounded-lg border border-gray-100">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">File Size (KB)</span>
          <span className="font-mono font-semibold text-brand-dark">
            {spec.minKb} KB – {spec.maxKb} KB
          </span>
        </div>

        <div className="bg-brand-lightBg p-2 rounded-lg border border-gray-100">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Accepted Format</span>
          <span className="font-mono font-semibold text-brand-dark">
            {spec.formatLabel}
          </span>
        </div>

        <div className="bg-brand-lightBg p-2 rounded-lg border border-gray-100">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Background</span>
          <span className="font-medium text-brand-dark truncate block">
            {spec.backgroundColor === 'white' ? 'Plain White' : 'Light / Off-White'}
          </span>
        </div>
      </div>

      {/* Mandatory instruction alert */}
      {spec.notes && (
        <p className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
          <strong>Official Note:</strong> {spec.notes}
        </p>
      )}
    </div>
  );
};
