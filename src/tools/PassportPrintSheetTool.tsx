import React, { useState, useEffect, useRef } from 'react';
import { UploadArea } from '../components/common/UploadArea';
import { SEOHead } from '../components/common/SEOHead';
import { 
  loadImage, 
  generatePassportPrintSheet, 
  PrintSheetOptions 
} from '../utils/imageProcessing';
import { createSamplePassportPhotoBlob } from '../utils/sampleImages';
import { 
  Printer, 
  Download, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Scissors, 
  Grid,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PassportPrintSheetTool: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [paperSize, setPaperSize] = useState<'a4' | '4x6'>('a4');
  const [photoCount, setPhotoCount] = useState<number>(8);
  const [includeCutMarks, setIncludeCutMarks] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sheetCanvas, setSheetCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFileSelect = async (file: File) => {
    try {
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (err: any) {
      alert(err.message || 'Failed to load photo.');
    }
  };

  const loadDemoPhoto = async () => {
    try {
      const file = await createSamplePassportPhotoBlob();
      const img = await loadImage(file);
      setSourceImage(img);
    } catch (e) {
      // ignore
    }
  };

  // Re-generate sheet whenever options change
  useEffect(() => {
    if (!sourceImage) return;

    setIsGenerating(true);
    const timer = setTimeout(() => {
      try {
        // Create 413x531 canvas of the photo (3.5x4.5 cm at 300 DPI)
        const photoCanvas = document.createElement('canvas');
        photoCanvas.width = 413;
        photoCanvas.height = 531;
        const pCtx = photoCanvas.getContext('2d');
        if (!pCtx) return;

        pCtx.fillStyle = '#FFFFFF';
        pCtx.fillRect(0, 0, 413, 531);
        pCtx.drawImage(sourceImage, 0, 0, 413, 531);

        const options: PrintSheetOptions = {
          paperSize,
          photoCount,
          includeCutMarks,
          borderWidthPx: 1
        };

        const canvas = generatePassportPrintSheet(photoCanvas, options);
        setSheetCanvas(canvas);

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        canvas.toBlob((blob) => {
          if (blob) {
            setPreviewUrl(URL.createObjectURL(blob));
          }
          setIsGenerating(false);
        }, 'image/jpeg', 0.92);
      } catch (e) {
        setIsGenerating(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [sourceImage, paperSize, photoCount, includeCutMarks]);

  const handleDownloadJpeg = () => {
    if (!sheetCanvas) return;
    const a = document.createElement('a');
    a.href = sheetCanvas.toDataURL('image/jpeg', 0.95);
    a.download = `Passport-Photos-${paperSize.toUpperCase()}-${photoCount}-Pack.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPdf = async () => {
    if (!sheetCanvas) return;
    try {
      const imgDataUrl = sheetCanvas.toDataURL('image/jpeg', 0.95);
      const pdfDoc = await PDFDocument.create();

      // A4 in points: 595.28 x 841.89; 4x6 in points: 288 x 432
      const isA4 = paperSize === 'a4';
      const pageW = isA4 ? 595.28 : 288;
      const pageH = isA4 ? 841.89 : 432;

      const page = pdfDoc.addPage([pageW, pageH]);
      const jpgImage = await pdfDoc.embedJpg(imgDataUrl);

      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: pageW,
        height: pageH
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Passport-Photos-${paperSize.toUpperCase()}-Print-Sheet.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('Could not export PDF: ' + e.message);
    }
  };

  const handlePrint = () => {
    if (!previewUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print view.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Passport Photos</title>
          <style>
            @page {
              size: ${paperSize === 'a4' ? 'A4 portrait' : '4in 6in'};
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${previewUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSourceImage(null);
    setPreviewUrl(null);
    setSheetCanvas(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="A4 Passport Photo Print Sheet Generator (300 DPI Print-Ready)"
        description="Tile your 3.5 x 4.5 cm passport photo into 4, 6, 8, 12, or 16 photos on A4 or 4x6 inch photo paper. Print directly with scissor cut lines."
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-navy text-saffron">
              <Printer className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
              A4 Passport Photo Print Sheet Generator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Print 4 to 32 passport photos on a single A4 or 4×6" photo paper sheet. High-res 300 DPI with scissor guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!sourceImage && (
            <button
              type="button"
              onClick={loadDemoPhoto}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-saffron/40 bg-saffron/15 hover:bg-saffron/25 text-xs font-bold text-navy transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
              <span>Load Sample Photo</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">100% Client-Side</span>
          </div>
        </div>
      </div>

      {!sourceImage ? (
        <div className="space-y-4">
          <UploadArea
            onFileSelect={handleFileSelect}
            label="Upload Prepared Passport Photograph"
            subLabel="Upload your photo to arrange on a printable A4 or 4×6 inch sheet"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-navy block mb-0.5">300 DPI Print Quality</span>
              <p className="text-[11px] text-gray-500">Exact 3.5 × 4.5 cm sizing ready for photo studio printers.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-navy block mb-0.5">Scissor Cut Marks</span>
              <p className="text-[11px] text-gray-500">Dashed guidelines & corner markers for easy straight cuts.</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
              <span className="text-xs font-bold text-navy block mb-0.5">A4 & 4×6" Standard Paper</span>
              <p className="text-[11px] text-gray-500">Fits home inkjet printers and professional photo labs.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Options Controls */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-navy">
                  Print Sheet Settings
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Change Photo
                </button>
              </div>

              {/* Paper Size Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Paper Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaperSize('a4');
                      if (photoCount < 6) setPhotoCount(8);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      paperSize === 'a4'
                        ? 'bg-navy text-white border-navy shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    A4 Paper (210×297mm)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaperSize('4x6');
                      if (photoCount > 8) setPhotoCount(6);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                      paperSize === '4x6'
                        ? 'bg-navy text-white border-navy shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    4×6" Photo Paper
                  </button>
                </div>
              </div>

              {/* Photo Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Number of Photos</label>
                <div className="grid grid-cols-3 gap-2">
                  {(paperSize === 'a4' ? [4, 6, 8, 12, 16, 30] : [2, 4, 6, 8]).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setPhotoCount(cnt)}
                      className={`py-1.5 px-2 rounded-lg border text-xs font-semibold transition ${
                        photoCount === cnt
                          ? 'bg-saffron text-navy border-saffron font-bold shadow-xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cnt} Photos
                    </button>
                  ))}
                </div>
              </div>

              {/* Cut marks toggle */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-navy" />
                  <span className="text-xs font-semibold text-gray-700">Scissor Cut Guides</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeCutMarks}
                  onChange={(e) => setIncludeCutMarks(e.target.checked)}
                  className="rounded text-navy focus:ring-navy w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Photo Specs Summary */}
              <div className="bg-brand-lightBg p-3 rounded-xl border border-gray-100 space-y-1 text-[11px] text-gray-600">
                <div className="flex justify-between">
                  <span>Photo Size:</span>
                  <span className="font-semibold text-navy">3.5 × 4.5 cm (35×45mm)</span>
                </div>
                <div className="flex justify-between">
                  <span>Pixel Dimensions:</span>
                  <span className="font-mono text-navy">413 × 531 px</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Resolution:</span>
                  <span className="font-semibold text-emerald-700">300 DPI Studio Quality</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-2.5 px-4 rounded-xl bg-navy hover:bg-navy-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Printer className="w-4 h-4 text-saffron" />
                  <span>Print Sheet Now</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadJpeg}
                    className="py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-navy" />
                    <span>Download JPG</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="py-2 px-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-navy" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sheet Preview */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-saffron-dark" />
                Live Print Sheet Preview ({paperSize.toUpperCase()})
              </span>
              <span className="text-[11px] font-mono text-gray-500">
                {paperSize === 'a4' ? '2480 × 3508 px' : '1200 × 1800 px'}
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-xl p-3 sm:p-6 flex items-center justify-center overflow-auto max-h-[620px] border border-gray-200 shadow-inner">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Print Sheet Preview"
                  className="max-h-[580px] w-auto object-contain shadow-2xl rounded-xs bg-white border border-gray-300"
                />
              ) : (
                <div className="py-20 text-center text-xs text-gray-400">
                  Generating print sheet...
                </div>
              )}
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              🖨️ For exact 3.5×4.5 cm physical prints, choose <strong>"Scale: 100%"</strong> or <strong>"Actual Size"</strong> in your printer settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
