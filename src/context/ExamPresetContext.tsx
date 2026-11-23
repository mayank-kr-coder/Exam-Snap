import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExamPreset, ExamDocumentSpec } from '../types/preset';
import { getSavedPresets, savePresets, resetPresetsToDefault } from '../utils/storage';
import { DEFAULT_EXAM_PRESETS } from '../exam-presets/defaultPresets';

interface ExamPresetContextType {
  presets: ExamPreset[];
  selectedPreset: ExamPreset | null;
  selectPresetById: (id: string | null) => void;
  updatePreset: (preset: ExamPreset) => void;
  addPreset: (preset: ExamPreset) => void;
  deletePreset: (id: string) => void;
  resetAllPresets: () => void;
  getActiveDocumentSpec: (type: 'photo' | 'signature' | 'thumb' | 'certificate') => ExamDocumentSpec | undefined;
}

const ExamPresetContext = createContext<ExamPresetContextType | undefined>(undefined);

export const ExamPresetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [presets, setPresets] = useState<ExamPreset[]>(() => {
    const saved = getSavedPresets();
    return saved && saved.length > 0 ? saved : DEFAULT_EXAM_PRESETS;
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>('ssc-cgl-chsl');

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
