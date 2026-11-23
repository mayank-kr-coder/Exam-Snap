import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExamPresets } from '../context/ExamPresetContext';
import { SEOHead } from '../components/common/SEOHead';
import { 
  getUsageStats, 
  getPricingConfig, 
  savePricingConfig, 
  PricingConfig 
} from '../utils/storage';
import { ExamPreset } from '../types/preset';
import { 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  ExternalLink,
  Calendar,
  Layers
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, adminEmail, logout } = useAuth();
  const { presets, updatePreset, addPreset, deletePreset, resetAllPresets } = useExamPresets();

  const [stats] = useState(() => getUsageStats());
  const [pricing, setPricing] = useState<PricingConfig>(() => getPricingConfig());
  const [pricingSaved, setPricingSaved] = useState(false);

  // Preset edit modal / state
  const [editingPreset, setEditingPreset] = useState<ExamPreset | null>(null);
  const [isNewPreset, setIsNewPreset] = useState(false);

  // If unauthenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    savePricingConfig(pricing);
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2500);
  };

  const handleEdit = (preset: ExamPreset) => {
    setEditingPreset(JSON.parse(JSON.stringify(preset)));
    setIsNewPreset(false);
  };

  const handleCreateNew = () => {
    const newP: ExamPreset = {
      id: 'custom-' + Date.now(),
      name: 'New Examination Preset',
      shortCode: 'EXAM-2026',
      category: 'custom',
      categoryLabel: 'Custom Exam',
      organization: 'Exam Authority Name',
      status: 'sample_demo',
      sourceUrl: 'https://example.gov.in',
      sourceName: 'Official Notification 2026',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      description: 'Requirements for candidate photographs and signatures.',
      documents: {
        photo: {
          id: 'photo-' + Date.now(),
          name: 'Passport Photograph',
          type: 'photo',
          requiredWidthPx: 350,
          requiredHeightPx: 450,
          minKb: 20,
          maxKb: 50,
          allowedFormats: ['image/jpeg'],
          formatLabel: 'JPG / JPEG',
          backgroundColor: 'light',
          requireDateStamp: false,
          requireNameStamp: false
        },
        signature: {
          id: 'sign-' + Date.now(),
          name: 'Signature',
          type: 'signature',
          requiredWidthPx: 350,
          requiredHeightPx: 140,
          minKb: 10,
          maxKb: 20,
          allowedFormats: ['image/jpeg'],
          formatLabel: 'JPG / JPEG',
          backgroundColor: 'white'
        }
      }
    };
    setEditingPreset(newP);
    setIsNewPreset(true);
  };

  const handleSavePresetModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPreset) return;

    if (isNewPreset) {
      addPreset(editingPreset);
    } else {
      updatePreset(editingPreset);
    }
    setEditingPreset(null);
  };

  const toggleVerified = (preset: ExamPreset) => {
    const updated: ExamPreset = {
      ...preset,
      status: preset.status === 'verified' ? 'sample_demo' : 'verified',
      lastVerifiedDate: new Date().toISOString().split('T')[0]
    };
    updatePreset(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="Admin Control Center"
        description="Protected administrator panel for managing exam preset specifications, official verification URLs, and pricing controls."
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-navy text-saffron">
              <Lock className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
              ExamSnap Admin Control Center
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Signed in as <span className="font-semibold text-navy">{adminEmail}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy hover:bg-navy-800 text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-saffron" />
            <span>Add Exam Preset</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition flex items-center gap-1.5 border border-red-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase">Total Docs Prepared</span>
          <p className="text-2xl font-extrabold text-navy font-mono">
            {stats.totalDocsPrepared.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Client-Side</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase">Photos Resized</span>
          <p className="text-2xl font-extrabold text-navy font-mono">
            {stats.photosProcessed.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500 font-medium">Across all exam categories</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase">Signatures & Thumbs</span>
          <p className="text-2xl font-extrabold text-navy font-mono">
            {stats.signaturesProcessed.toLocaleString()}
          </p>
          <span className="text-[11px] text-gray-500 font-medium">Enhanced & Paper Whitened</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle space-y-1">
          <span className="text-xs font-medium text-gray-400 uppercase">PDFs Compressed</span>
          <p className="text-2xl font-extrabold text-navy font-mono">
            {stats.pdfsCompressed.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            ~{(stats.totalSavedBytes / (1024 * 1024)).toFixed(0)} MB bandwidth saved
          </span>
        </div>
      </div>

      {/* Pricing Configuration Card */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-saffron-dark" />
            <h3 className="font-bold text-base text-navy">Manage Exam Pack Pricing</h3>
          </div>
          {pricingSaved && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Pricing Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSavePricing} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Price Amount (INR)
            </label>
            <input
              type="number"
              min="1"
              value={pricing.packPrice}
              onChange={(e) => setPricing({ ...pricing, packPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Badge Label
            </label>
            <input
              type="text"
              value={pricing.badgeText}
              onChange={(e) => setPricing({ ...pricing, badgeText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              value={pricing.enabled ? 'active' : 'disabled'}
              onChange={(e) => setPricing({ ...pricing, enabled: e.target.value === 'active' })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white"
            >
              <option value="active">Active & Available</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-navy hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4 text-saffron" />
            <span>Update Pricing</span>
          </button>
        </form>
      </div>

      {/* Preset Management Table */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-bold text-base text-navy">Manage Exam Presets ({presets.length})</h3>
            <p className="text-xs text-gray-500">
              Update photo dimensions, file sizes, verification status, and notification URLs.
            </p>
          </div>

          <button
            type="button"
            onClick={resetAllPresets}
            className="text-xs text-gray-500 hover:text-navy flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Official Defaults</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Exam Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Photo Specs</th>
                <th className="py-2.5 px-3">Signature Specs</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Verified Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {presets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <p className="font-semibold text-sm text-navy mb-1">No presets loaded.</p>
                    <p className="text-xs mb-3">Click below to restore all official verified presets (SSC, UPSC, Railway, Banking).</p>
                    <button
                      type="button"
                      onClick={resetAllPresets}
                      className="px-3.5 py-1.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-800 transition"
                    >
                      Restore Official Presets
                    </button>
                  </td>
                </tr>
              ) : (
                presets.map((preset) => {
                const isVerified = preset.status === 'verified';
                const pSpec = preset.documents.photo;
                const sSpec = preset.documents.signature;

                return (
                  <tr key={preset.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-3 font-semibold text-brand-dark">
                      <div>{preset.name}</div>
                      <span className="text-[10px] text-gray-400 font-mono">{preset.shortCode}</span>
                    </td>
                    <td className="py-3 px-3 capitalize text-gray-600">{preset.category}</td>
                    <td className="py-3 px-3 font-mono text-gray-700">
                      {pSpec?.requiredWidthPx}×{pSpec?.requiredHeightPx} px ({pSpec?.minKb}–{pSpec?.maxKb} KB)
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-700">
                      {sSpec?.requiredWidthPx}×{sSpec?.requiredHeightPx} px ({sSpec?.minKb}–{sSpec?.maxKb} KB)
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleVerified(preset)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                        title="Click to toggle verified status"
                      >
                        {isVerified ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>Demo Notice</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                      {preset.lastVerifiedDate}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(preset)}
                        className="p-1.5 text-navy hover:bg-gray-100 rounded-lg"
                        title="Edit specifications"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePreset(preset.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete preset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-navy">
                {isNewPreset ? 'Create New Exam Preset' : `Edit Preset: ${editingPreset.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPreset(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePresetModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Exam Name</label>
                  <input
                    type="text"
                    required
                    value={editingPreset.name}
                    onChange={(e) => setEditingPreset({ ...editingPreset, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Short Code</label>
                  <input
                    type="text"
                    required
                    value={editingPreset.shortCode}
                    onChange={(e) => setEditingPreset({ ...editingPreset, shortCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Official Notification URL</label>
                  <input
                    type="url"
                    value={editingPreset.sourceUrl}
                    onChange={(e) => setEditingPreset({ ...editingPreset, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Verification Date</label>
                  <input
                    type="date"
                    value={editingPreset.lastVerifiedDate}
                    onChange={(e) => setEditingPreset({ ...editingPreset, lastVerifiedDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Photo Specs Box */}
              <div className="p-3 bg-brand-lightBg rounded-xl space-y-2 border border-gray-200">
                <span className="font-bold text-navy block">Passport Photograph Upload Rules</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-gray-500 mb-0.5">Width (px)</label>
                    <input
                      type="number"
                      value={editingPreset.documents.photo?.requiredWidthPx || 413}
                      onChange={(e) => {
                        const photo = { ...(editingPreset.documents.photo || {}), requiredWidthPx: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, photo: photo as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Height (px)</label>
                    <input
                      type="number"
                      value={editingPreset.documents.photo?.requiredHeightPx || 531}
                      onChange={(e) => {
                        const photo = { ...(editingPreset.documents.photo || {}), requiredHeightPx: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, photo: photo as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Min KB</label>
                    <input
                      type="number"
                      value={editingPreset.documents.photo?.minKb || 20}
                      onChange={(e) => {
                        const photo = { ...(editingPreset.documents.photo || {}), minKb: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, photo: photo as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Max KB</label>
                    <input
                      type="number"
                      value={editingPreset.documents.photo?.maxKb || 50}
                      onChange={(e) => {
                        const photo = { ...(editingPreset.documents.photo || {}), maxKb: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, photo: photo as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPreset.documents.photo?.requireDateStamp || false}
                      onChange={(e) => {
                        const photo = { ...(editingPreset.documents.photo || {}), requireDateStamp: e.target.checked };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, photo: photo as any } });
                      }}
                      className="w-3.5 h-3.5 accent-navy"
                    />
                    <span>Requires Date Stamp</span>
                  </label>
                </div>
              </div>

              {/* Signature Specs Box */}
              <div className="p-3 bg-brand-lightBg rounded-xl space-y-2 border border-gray-200">
                <span className="font-bold text-navy block">Signature Upload Rules</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-gray-500 mb-0.5">Width (px)</label>
                    <input
                      type="number"
                      value={editingPreset.documents.signature?.requiredWidthPx || 472}
                      onChange={(e) => {
                        const sig = { ...(editingPreset.documents.signature || {}), requiredWidthPx: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, signature: sig as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Height (px)</label>
                    <input
                      type="number"
                      value={editingPreset.documents.signature?.requiredHeightPx || 236}
                      onChange={(e) => {
                        const sig = { ...(editingPreset.documents.signature || {}), requiredHeightPx: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, signature: sig as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Min KB</label>
                    <input
                      type="number"
                      value={editingPreset.documents.signature?.minKb || 10}
                      onChange={(e) => {
                        const sig = { ...(editingPreset.documents.signature || {}), minKb: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, signature: sig as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-0.5">Max KB</label>
                    <input
                      type="number"
                      value={editingPreset.documents.signature?.maxKb || 20}
                      onChange={(e) => {
                        const sig = { ...(editingPreset.documents.signature || {}), maxKb: Number(e.target.value) };
                        setEditingPreset({ ...editingPreset, documents: { ...editingPreset.documents, signature: sig as any } });
                      }}
                      className="w-full px-2 py-1.5 border rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPreset(null)}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-navy text-white font-bold rounded-xl"
                >
                  Save Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
