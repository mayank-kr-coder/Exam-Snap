import { injectJfifDpi } from './imageProcessing';

export interface CompressionResult {
  blob: Blob;
  sizeBytes: number;
  sizeKb: number;
  quality: number;
  width: number;
  height: number;
  isWithinTarget: boolean;
  achievedTarget: boolean;
  qualityDegradedNotice?: boolean;
  message: string;
}

/**
 * Converts a Canvas to a JPEG/PNG Blob at a specific quality factor with JFIF 300 DPI metadata injection
 */
export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string = 'image/jpeg',
  quality: number = 0.85,
  dpi: number = 300
): Promise<Blob> {
  const rawBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      },
      format,
      quality
    );
  });

  if ((format === 'image/jpeg' || format.includes('jpeg')) && dpi > 0) {
    return injectJfifDpi(rawBlob, dpi);
  }

  return rawBlob;
}

/**
 * Binary search iterative compression to hit exact target KB range [targetMinKb, targetMaxKb]
 */
export async function compressCanvasToTarget(
  canvas: HTMLCanvasElement,
  targetMinKb: number = 20,
  targetMaxKb: number = 50,
  options: {
    maxIterations?: number;
    preferredQuality?: number;
    allowDownscaleIfTooLarge?: boolean;
  } = {}
): Promise<CompressionResult> {
  const maxIterations = options.maxIterations || 8;
  const targetMinBytes = targetMinKb * 1024;
  const targetMaxBytes = targetMaxKb * 1024;

  let currentCanvas = canvas;
  let currentWidth = canvas.width;
  let currentHeight = canvas.height;

  // First trial at default 0.88 quality
  let quality = options.preferredQuality || 0.85;
  let blob = await canvasToBlob(currentCanvas, 'image/jpeg', quality);

  // If already in target range, return immediately
  if (blob.size >= targetMinBytes && blob.size <= targetMaxBytes) {
    return {
      blob,
      sizeBytes: blob.size,
      sizeKb: Number((blob.size / 1024).toFixed(1)),
      quality: Number(quality.toFixed(2)),
      width: currentWidth,
      height: currentHeight,
      isWithinTarget: true,
      achievedTarget: true,
      message: `Optimal quality reached (${(blob.size / 1024).toFixed(1)} KB)`
    };
  }

  // Binary search boundaries
  let lowQuality = 0.05;
  let highQuality = 0.98;
  let bestBlob = blob;
  let bestQuality = quality;
  let closestDiff = Math.abs(blob.size - ((targetMinBytes + targetMaxBytes) / 2));

  for (let iter = 0; iter < maxIterations; iter++) {
    // If blob is too big, decrease quality
    if (blob.size > targetMaxBytes) {
      highQuality = quality;
      quality = (lowQuality + highQuality) / 2;
    } else if (blob.size < targetMinBytes) {
      // If blob is too small, increase quality
      lowQuality = quality;
      quality = (lowQuality + highQuality) / 2;
    } else {
      // Perfect match inside bounds!
      return {
        blob,
        sizeBytes: blob.size,
        sizeKb: Number((blob.size / 1024).toFixed(1)),
        quality: Number(quality.toFixed(2)),
        width: currentWidth,
        height: currentHeight,
        isWithinTarget: true,
        achievedTarget: true,
        message: `Successfully fitted in target range (${(blob.size / 1024).toFixed(1)} KB)`
      };
    }

    blob = await canvasToBlob(currentCanvas, 'image/jpeg', quality);

    const diff = Math.abs(blob.size - ((targetMinBytes + targetMaxBytes) / 2));
    if (diff < closestDiff) {
      closestDiff = diff;
      bestBlob = blob;
      bestQuality = quality;
    }

    // Terminate early if search interval is tiny
    if (highQuality - lowQuality < 0.02) break;
  }

  // Check if bestBlob is within range
  const isWithin = bestBlob.size >= targetMinBytes && bestBlob.size <= targetMaxBytes;

  if (isWithin) {
    return {
      blob: bestBlob,
      sizeBytes: bestBlob.size,
      sizeKb: Number((bestBlob.size / 1024).toFixed(1)),
      quality: Number(bestQuality.toFixed(2)),
      width: currentWidth,
      height: currentHeight,
      isWithinTarget: true,
      achievedTarget: true,
      message: `Fitted to ${(bestBlob.size / 1024).toFixed(1)} KB (Target: ${targetMinKb}–${targetMaxKb} KB)`
    };
  }

  // If still too large and allowDownscaleIfTooLarge is enabled
  if (bestBlob.size > targetMaxBytes && options.allowDownscaleIfTooLarge && currentWidth > 200) {
    const scaleFactor = 0.85;
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = Math.round(currentWidth * scaleFactor);
    scaledCanvas.height = Math.round(currentHeight * scaleFactor);
    const sCtx = scaledCanvas.getContext('2d');
    if (sCtx) {
      sCtx.drawImage(currentCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
      const scaledResult = await compressCanvasToTarget(
        scaledCanvas,
        targetMinKb,
        targetMaxKb,
        { ...options, allowDownscaleIfTooLarge: false }
      );
      if (scaledResult.achievedTarget) {
        return scaledResult;
      }
    }
  }

  // Handle case where size is still below minimum (e.g. very plain white signature image)
  if (bestBlob.size < targetMinBytes) {
    return {
      blob: bestBlob,
      sizeBytes: bestBlob.size,
      sizeKb: Number((bestBlob.size / 1024).toFixed(1)),
      quality: 0.98,
      width: currentWidth,
      height: currentHeight,
      isWithinTarget: false,
      achievedTarget: false,
      message: `Document is ${(bestBlob.size / 1024).toFixed(1)} KB (Portals may require min ${targetMinKb} KB. Try exporting at higher resolution or uncompressed)`
    };
  }

  // Case where size cannot be compressed below max without extreme artifacts
  return {
    blob: bestBlob,
    sizeBytes: bestBlob.size,
    sizeKb: Number((bestBlob.size / 1024).toFixed(1)),
    quality: Number(bestQuality.toFixed(2)),
    width: currentWidth,
    height: currentHeight,
    isWithinTarget: false,
    achievedTarget: false,
    qualityDegradedNotice: true,
    message: `Reached ${(bestBlob.size / 1024).toFixed(1)} KB. Max limit is ${targetMaxKb} KB. Try cropping closer or reducing dimensions.`
  };
}
