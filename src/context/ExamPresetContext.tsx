import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExamPreset, ExamDocumentSpec } from '../types/preset';
import { getSavedPresets, savePresets, resetPresetsToDefault } from '../utils/storage';
import { DEFAULT_EXAM_PRESETS } from '../exam-presets/defaultPresets';

interface ExamPresetContextType {
  presets: ExamPreset[];
  selectedPreset: ExamPreset | null;
  selectPresetById: (id: string | null) => void;
  clearPresetSelection: () => void;
  updatePreset: (preset: ExamPreset) => void;
  addPreset: (preset: ExamPreset) => void;
  deletePreset: (id: string) => void;
  resetAllPresets: () => void;
  getActiveDocumentSpec: (type: 'photo' | 'signature' | 'thumb' | 'certificate') => ExamDocumentSpec | undefined;
}

const ExamPresetContext = createContext<ExamPresetContextType | undefined>(undefined);

const ACTIVE_PRESET_STORAGE_KEY = 'examsnap_active_preset_id';

export const ExamPresetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presets, setPresets] = useState<ExamPreset[]>(() => {
    const saved = getSavedPresets();
    return saved && saved.length > 0 ? saved : DEFAULT_EXAM_PRESETS;
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_PRESET_STORAGE_KEY);
      if (stored !== null) {
        return stored === '' ? null : stored;
      }
    } catch {
      // Fallback
    }
    return 'ssc-cgl-chsl';
  });

  useEffect(() => {
    if (presets.length === 0) {
      setPresets(DEFAULT_EXAM_PRESETS);
    } else {
      savePresets(presets);
    }
  }, [presets]);

  const selectedPreset = presets.find((p) => p.id === selectedPresetId) || null;

  const selectPresetById = (id: string | null) => {
    setSelectedPresetId(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_PRESET_STORAGE_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_PRESET_STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const clearPresetSelection = () => {
    selectPresetById(null);
  };

  const updatePreset = (updated: ExamPreset) => {
    setPresets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addPreset = (newPreset: ExamPreset) => {
    setPresets((prev) => [newPreset, ...prev]);
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
    if (selectedPresetId === id) {
      setSelectedPresetId(null);
    }
  };

  const resetAllPresets = () => {
    const defaults = resetPresetsToDefault();
    setPresets(defaults);
    setSelectedPresetId('ssc-cgl-chsl');
  };

  const getActiveDocumentSpec = (type: 'photo' | 'signature' | 'thumb' | 'certificate'): ExamDocumentSpec | undefined => {
    if (!selectedPreset) return undefined;
    return selectedPreset.documents[type];
  };

  return (
    <ExamPresetContext.Provider
      value={{
        presets,
        selectedPreset,
        selectPresetById,
        clearPresetSelection,
        updatePreset,
        addPreset,
        deletePreset,
        resetAllPresets,
        getActiveDocumentSpec
      }}
    >
      {children}
    </ExamPresetContext.Provider>
  );
};

export function useExamPresets() {
  const context = useContext(ExamPresetContext);
  if (!context) {
    throw new Error('useExamPresets must be used within an ExamPresetProvider');
  }
  return context;
}
