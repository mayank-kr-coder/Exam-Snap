import { PDFDocument } from 'pdf-lib';

export interface PdfProcessingResult {
  pdfBlob: Blob;
  originalSizeBytes: number;
  originalSizeKb: number;
  newSizeBytes: number;
  newSizeKb: number;
  compressionRatioPercent: number;
  pageCount: number;
  isCompressed: boolean;
  message: string;
}

/**
 * Optimizes and compresses a PDF in the browser using pdf-lib
 * Uses stream compression, metadata stripping, and structure re-serialization
 */
export async function optimizePdf(
  file: File,
  options: {
    stripMetadata?: boolean;
    useObjectStreams?: boolean;
  } = { stripMetadata: true, useObjectStreams: true }
): Promise<PdfProcessingResult> {
  const originalBuffer = await file.arrayBuffer();
  const originalSizeBytes = file.size;
  const originalSizeKb = Number((originalSizeBytes / 1024).toFixed(1));

  // Load PDF with pdf-lib
  const pdfDoc = await PDFDocument.load(originalBuffer, { 
    ignoreEncryption: false,
    updateMetadata: false
  });

  const pageCount = pdfDoc.getPageCount();

  if (options.stripMetadata) {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('ExamSnap Sarkari Doc Prep Optimizer');
    pdfDoc.setCreator('');
  }

  // Create a clean new target document to avoid residual garbage objects
  const compressedDoc = await PDFDocument.create();
  const copiedPages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
  copiedPages.forEach((page) => compressedDoc.addPage(page));

  // Save with maximum object stream compression
  const compressedPdfBytes = await compressedDoc.save({
    useObjectStreams: options.useObjectStreams !== false,
    addDefaultPage: false,
    objectsPerTick: 50
  });

  const newSizeBytes = compressedPdfBytes.byteLength;
  const newSizeKb = Number((newSizeBytes / 1024).toFixed(1));
  const isActuallySmaller = newSizeBytes < originalSizeBytes;
  const diffBytes = originalSizeBytes - newSizeBytes;
  const compressionRatioPercent = isActuallySmaller
    ? Number(((diffBytes / originalSizeBytes) * 100).toFixed(1))
    : 0;

  // If new size is not smaller (already optimized or compressed streams inflated metadata),
  // return original with clear honesty as per guidelines!
  if (!isActuallySmaller) {
    return {
      pdfBlob: new Blob([originalBuffer], { type: 'application/pdf' }),
      originalSizeBytes,
      originalSizeKb,
      newSizeBytes: originalSizeBytes,
      newSizeKb: originalSizeKb,
      compressionRatioPercent: 0,
      pageCount,
      isCompressed: false,
      message: 'PDF is already highly optimized. Re-compressing would not reduce its file size further.'
    };
  }

  const pdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });

  return {
    pdfBlob,
    originalSizeBytes,
    originalSizeKb,
    newSizeBytes,
    newSizeKb,
    compressionRatioPercent,
    pageCount,
    isCompressed: true,
    message: `Reduced by ${compressionRatioPercent}% (${originalSizeKb} KB → ${newSizeKb} KB)`
  };
}
