import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamPresets } from '../context/ExamPresetContext';
import { SEOHead } from '../components/common/SEOHead';
import { 
  ShieldCheck, 
  AlertCircle, 
  ExternalLink, 
  Calendar, 
  ArrowRight, 
  Check, 
  Search,
  Sparkles
} from 'lucide-react';

export const ExamPresetsPage: React.FC = () => {
  const { presets, selectPresetById, selectedPreset } = useExamPresets();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredPresets = presets.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.organization.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApplyPreset = (presetId: string, tool: 'photo' | 'signature') => {
    selectPresetById(presetId);
    if (tool === 'photo') {
      navigate('/tools/passport-photo-resizer');
    } else {
      navigate('/tools/signature-resizer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="Official Exam Presets & Document Upload Rules 2026"
        description="Browse official photo and signature upload requirements for SSC, UPSC, Railways, Banking (IBPS/SBI), and State PSCs with notification source links and verified dates."
      />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy">
          Configured Exam Presets
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Official document dimensions, file sizes, format constraints, and date stamp rules verified against recruitment notifications.
        </p>
      </div>

      {/* Filter Category & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex flex-wrap bg-white rounded-xl p-1 border border-brand-border text-xs shadow-subtle">
          {['all', 'ssc', 'upsc', 'railway', 'banking', 'state', 'university'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                filterCategory === cat ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
              }`}
            >
              {cat === 'all' ? 'All Exams' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam presets..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl bg-white shadow-subtle focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPresets.map((preset) => {
          const isSelected = selectedPreset?.id === preset.id;
          const isVerified = preset.status === 'verified';
          const photoSpec = preset.documents.photo;
          const signSpec = preset.documents.signature;

          return (
            <div
              key={preset.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition shadow-subtle ${
                isSelected ? 'border-navy ring-2 ring-navy/10' : 'border-brand-border hover:border-gray-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-navy">{preset.name}</h3>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Specs
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Demo – Verify Notice
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{preset.organization}</p>
                  </div>

                  <span className="text-[10px] font-mono font-bold bg-brand-lightBg px-2 py-1 rounded text-navy">
                    {preset.shortCode}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{preset.description}</p>

                {/* Specs breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Photo details */}
                  {photoSpec && (
                    <div className="p-3 bg-brand-lightBg rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-navy block">
                        Passport Photograph
                      </span>
                      <p className="font-mono text-gray-800">
                        {photoSpec.requiredWidthPx && photoSpec.requiredHeightPx
                          ? `${photoSpec.requiredWidthPx} × ${photoSpec.requiredHeightPx} px`
                          : `${photoSpec.widthCm} × ${photoSpec.heightCm} cm`}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Size: {photoSpec.minKb}–{photoSpec.maxKb} KB ({photoSpec.formatLabel})
                      </p>
                      {photoSpec.requireDateStamp && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block">
                          Requires Name & Date Stamp
                        </span>
                      )}
                    </div>
                  )}

                  {/* Signature details */}
                  {signSpec && (
                    <div className="p-3 bg-brand-lightBg rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-navy block">
                        Signature Upload
                      </span>
                      <p className="font-mono text-gray-800">
                        {signSpec.requiredWidthPx && signSpec.requiredHeightPx
                          ? `${signSpec.requiredWidthPx} × ${signSpec.requiredHeightPx} px`
                          : `${signSpec.widthCm} × ${signSpec.heightCm} cm`}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Size: {signSpec.minKb}–{signSpec.maxKb} KB ({signSpec.formatLabel})
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {signSpec.backgroundColor === 'white' ? 'Plain white paper' : 'Light paper'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Official Source & Verification Date */}
                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    Last Verified: {preset.lastVerifiedDate}
                  </span>

                  {preset.sourceUrl && (
                    <a
                      href={preset.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Official Notice</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset(preset.id, 'photo')}
                  className="flex-1 py-2 px-3 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                >
                  <span>Format Photo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(preset.id, 'signature')}
                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-navy rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
                >
                  <span>Format Signature</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
