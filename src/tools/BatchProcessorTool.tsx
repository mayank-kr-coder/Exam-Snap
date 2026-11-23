import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { 
  loadImage, 
  processImageToCanvas 
} from '../utils/imageProcessing';
import { compressCanvasToTarget } from '../utils/compression';
import { 
  Layers, 
  Upload, 
  Download, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck, 
  RefreshCw,
  Archive
} from 'lucide-react';
import JSZip from 'jszip';

interface BatchItem {
  id: string;
  originalFile: File;
  originalSizeKb: number;
  previewUrl: string;
  processedBlob: Blob | null;
  processedSizeKb: number | null;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export const BatchProcessorTool: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [formatOption, setFormatOption] = useState<'keep' | 'jpeg'>('jpeg');
  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const newItems: BatchItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      originalSizeKb: Number((file.size / 1024).toFixed(1)),
      previewUrl: URL.createObjectURL(file),
      processedBlob: null,
      processedSizeKb: null,
      status: 'idle'
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const processSingleItem = async (item: BatchItem, targetMaxKb: number): Promise<BatchItem> => {
    try {
      const img = await loadImage(item.originalFile);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context failed');

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const comp = await compressCanvasToTarget(canvas, Math.max(5, targetMaxKb * 0.4), targetMaxKb);

      return {
        ...item,
        processedBlob: comp.blob,
        processedSizeKb: comp.sizeKb,
        status: 'done'
      };
    } catch (err: any) {
      return {
        ...item,
        status: 'error',
        errorMessage: err.message || 'Processing failed'
      };
    }
  };

  const processAll = async () => {
    if (items.length === 0) return;
    setIsProcessingAll(true);

    const updated: BatchItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'processing' } : it))
      );
      const result = await processSingleItem(item, targetKb);
      updated.push(result);
      setItems((prev) => prev.map((it, idx) => (idx === i ? result : it)));
    }

    setIsProcessingAll(false);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((it) => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
    setItems([]);
  };

  const downloadZip = async () => {
    const doneItems = items.filter((it) => it.processedBlob !== null);
    if (doneItems.length === 0) {
      alert('Please process images first.');
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder('ExamSnap-Batch-Documents');

      doneItems.forEach((it) => {
        const ext = formatOption === 'jpeg' ? 'jpg' : 'png';
        const baseName = it.originalFile.name.replace(/\.[^/.]+$/, '');
        const filename = `${baseName}-compressed-${it.processedSizeKb}kb.${ext}`;
        folder?.file(filename, it.processedBlob as Blob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ExamSnap-Batch-Images-${doneItems.length}-Files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('ZIP packaging failed: ' + e.message);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: BatchItem) => {
    if (!item.processedBlob) return;
    const url = URL.createObjectURL(item.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = item.originalFile.name.replace(/\.[^/.]+$/, '');
    a.download = `${baseName}-compressed-${item.processedSizeKb}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalOriginalKb = items.reduce((sum, it) => sum + it.originalSizeKb, 0);
  const totalProcessedKb = items.reduce((sum, it) => sum + (it.processedSizeKb || it.originalSizeKb), 0);
  const totalSavedKb = Math.max(0, totalOriginalKb - totalProcessedKb);
  const completedCount = items.filter((it) => it.status === 'done').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Batch Image Processor & Compressor (Bulk Documents to ZIP)"
        description="Resize, compress and convert multiple photos, signatures, and certificates in one batch. Download all processed documents in a single ZIP file. 100% Free & In-Browser."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-navy text-saffron">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
              Batch Image Processor & Bulk Compressor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Compress and convert multiple photographs and documents at once. Download all files in a single ZIP.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Local Processing (Zero Uploads)</span>
        </div>
      </div>

      {/* Settings Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Target Size per File</label>
              <div className="flex items-center gap-1.5">
                {[20, 50, 100, 200].map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetKb(kb)}
                    className={`px-3 py-1 rounded-lg border text-xs font-semibold transition ${
                      targetKb === kb
                        ? 'bg-navy text-white border-navy font-bold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    under {kb} KB
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">Output Format</label>
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-navy border border-gray-200">
                JPEG / JPG (Standard Exam Format)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy hover:bg-navy-800 text-white font-bold text-xs shadow-md transition active:scale-95">
              <Upload className="w-4 h-4 text-saffron" />
              <span>+ Add Files</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Stats strip if items loaded */}
        {items.length > 0 && (
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-600">
                Total Files: <strong className="text-navy">{items.length}</strong>
              </span>
              <span className="font-semibold text-gray-600">
                Completed: <strong className="text-emerald-700">{completedCount} / {items.length}</strong>
              </span>
              {totalSavedKb > 0 && (
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ~{(totalSavedKb / 1024).toFixed(2)} MB Saved
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={processAll}
                disabled={isProcessingAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron hover:bg-saffron-dark text-navy font-bold text-xs shadow-xs transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessingAll ? 'animate-spin' : ''}`} />
                <span>{isProcessingAll ? 'Processing All...' : 'Compress All Now'}</span>
              </button>

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={downloadZip}
                  disabled={isZipping}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{isZipping ? 'Creating ZIP...' : `Download ZIP (${completedCount} Files)`}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Files List Grid */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-navy/5 mx-auto flex items-center justify-center text-navy">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-navy">No files added yet</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select multiple photos or signatures from your device to compress in batch.
            </p>
          </div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-800 transition">
            <span>Browse Files</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFiles}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={item.previewUrl}
                  alt={item.originalFile.name}
                  className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-gray-50 p-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-navy truncate" title={item.originalFile.name}>
                    {item.originalFile.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                    Original: {item.originalSizeKb} KB
                  </p>
                  {item.processedSizeKb !== null && (
                    <p className="text-[11px] font-bold text-emerald-700 font-mono">
                      Compressed: {item.processedSizeKb} KB
                    </p>
                  )}
                  {item.status === 'processing' && (
                    <span className="text-[10px] text-saffron-dark font-semibold animate-pulse">
                      Processing...
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-[10px] text-rose-600 font-semibold">
                      {item.errorMessage || 'Failed'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-rose-600 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-medium">
                  Target: &lt; {targetKb} KB
                </span>

                {item.processedBlob ? (
                  <button
                    type="button"
                    onClick={() => downloadSingle(item)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-navy hover:text-saffron-dark transition"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      setItems((prev) =>
                        prev.map((it) => (it.id === item.id ? { ...it, status: 'processing' } : it))
                      );
                      const res = await processSingleItem(item, targetKb);
                      setItems((prev) => prev.map((it) => (it.id === item.id ? res : it)));
                    }}
                    className="text-[11px] font-semibold text-navy hover:underline"
                  >
                    Compress Single
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
