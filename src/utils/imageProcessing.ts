export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StampOptions {
  enabled: boolean;
  name?: string;
  date?: string;
  fontSize?: number;
  position?: 'bottom' | 'top';
  backgroundColor?: string;
  textColor?: string;
}

export interface ImageAdjustments {
  brightness?: number; // -100 to 100 (0 default)
  contrast?: number;   // -100 to 100 (0 default)
  grayscale?: boolean;
  whiteBackgroundClean?: boolean; // binarize / clean paper for signatures
  cleanThreshold?: number; // 0 to 255 (e.g. 195)
  replaceBackground?: boolean;
  bgTolerance?: number; // 10 to 100
  targetBgColor?: string; // e.g. '#ffffff' or '#f0f4f8'
}

/**
 * Loads an image file or object URL safely into an HTMLImageElement
 */
export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl: string | null = null;
    if (typeof source === 'string') {
      img.src = source;
    } else {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    }

    img.onload = () => {
      if (objectUrl) {
        // We clean up after image is decoded or keep it if needed
      }
      resolve(img);
    };

    img.onerror = (err) => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image. File may be corrupted or unsupported format.'));
    };
  });
}

/**
 * Converts physical dimensions (cm/mm) to pixels based on target DPI (dots per inch)
 * 1 inch = 2.54 cm = 25.4 mm
 */
export function cmToPixels(cm: number, dpi: number = 300): number {
  return Math.round((cm / 2.54) * dpi);
}

export function mmToPixels(mm: number, dpi: number = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

export function pixelsToCm(px: number, dpi: number = 300): number {
  return Number(((px / dpi) * 2.54).toFixed(2));
}

/**
 * Apply pixel-level image adjustments (brightness, contrast, signature paper cleaning, background replacement)
 */
export function applyImageFilters(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adjustments: ImageAdjustments
) {
  const {
    brightness = 0,
    contrast = 0,
    grayscale = false,
    whiteBackgroundClean = false,
    cleanThreshold = 195,
    replaceBackground = false,
    bgTolerance = 45,
    targetBgColor = '#ffffff'
  } = adjustments;

  if (
    brightness === 0 &&
    contrast === 0 &&
    !grayscale &&
    !whiteBackgroundClean &&
    !replaceBackground
  ) {
    return; // No filters to apply
  }

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Calculate contrast factor: contrast ranges -100 to 100
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  // Determine sampled background color if background replacement is enabled
  let sampleR = 240, sampleG = 240, sampleB = 240;
  if (replaceBackground) {
    // Sample top-left corner average
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    const sampleSize = Math.min(15, Math.floor(width / 10), Math.floor(height / 10));
    for (let sy = 0; sy < sampleSize; sy++) {
      for (let sx = 0; sx < sampleSize; sx++) {
        const idx = (sy * width + sx) * 4;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
    if (count > 0) {
      sampleR = rSum / count;
      sampleG = gSum / count;
      sampleB = bSum / count;
    }
  }

  // Parse target background color
  const targetR = parseInt(targetBgColor.slice(1, 3), 16) || 255;
  const targetG = parseInt(targetBgColor.slice(3, 5), 16) || 255;
  const targetB = parseInt(targetBgColor.slice(5, 7), 16) || 255;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Signature paper whitening / binarization
    if (whiteBackgroundClean) {
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      if (luminance > cleanThreshold) {
        // Whiten paper imperfections, shadows, folded marks
        r = 255;
        g = 255;
        b = 255;
      } else {
        // Deepen signature ink for sharp clarity
        r = Math.max(0, r - 35);
        g = Math.max(0, g - 35);
        b = Math.max(0, b - 35);
      }
    }

    // 2. Background cleaner / replacer for photos
    if (replaceBackground) {
      const dist = Math.sqrt(
        Math.pow(r - sampleR, 2) +
        Math.pow(g - sampleG, 2) +
        Math.pow(b - sampleB, 2)
      );

      if (dist < bgTolerance) {
        const alpha = Math.max(0, Math.min(1, (dist / bgTolerance)));
        r = Math.round(targetR * (1 - alpha) + r * alpha);
        g = Math.round(targetG * (1 - alpha) + g * alpha);
        b = Math.round(targetB * (1 - alpha) + b * alpha);
      }
    }

    // 3. Brightness adjustment
    if (brightness !== 0) {
      r += brightness;
      g += brightness;
      b += brightness;
    }

    // 4. Contrast adjustment
    if (contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    // 5. Grayscale (for black & white requirements e.g. state exams / thumbprints)
    if (grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    }

    // Clamp values 0 - 255
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Draws candidate Name & Date of Photo (DOP / DOB) stamp box on the canvas
 * Strictly adhering to SSC / Govt notification standards (white bottom bar with bold sans-serif text)
 */
export function drawDateStamp(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  stamp: StampOptions
) {
  if (!stamp.enabled || (!stamp.name && !stamp.date)) return;

  const barHeight = Math.max(48, Math.round(height * 0.16));
  const yPos = stamp.position === 'top' ? 0 : height - barHeight;

  // Background box
  ctx.save();
  ctx.fillStyle = stamp.backgroundColor || '#FFFFFF';
  ctx.fillRect(0, yPos, width, barHeight);

  // Top border line for separation
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (stamp.position === 'top') {
    ctx.moveTo(0, barHeight);
    ctx.lineTo(width, barHeight);
  } else {
    ctx.moveTo(0, yPos);
    ctx.lineTo(width, yPos);
  }
  ctx.stroke();

  // Text settings
  ctx.fillStyle = stamp.textColor || '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const defaultFontSize = Math.max(12, Math.round(barHeight * 0.28));
  const fontSize = stamp.fontSize || defaultFontSize;
  ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;

  const lines: string[] = [];
  if (stamp.name?.trim()) {
    lines.push(stamp.name.trim().toUpperCase());
  }
  if (stamp.date?.trim()) {
    lines.push(stamp.date.trim());
  }

  if (lines.length === 1) {
    ctx.fillText(lines[0], width / 2, yPos + barHeight / 2);
  } else if (lines.length === 2) {
    const lineSpacing = fontSize * 1.15;
    const startY = yPos + (barHeight - lineSpacing) / 2;
    ctx.fillText(lines[0], width / 2, startY);
    ctx.fillText(lines[1], width / 2, startY + lineSpacing);
  }

  ctx.restore();
}

/**
 * Renders the final cropped, resized, filtered and stamped image to an offscreen canvas
 */
export function processImageToCanvas(
  image: HTMLImageElement,
  cropRect: CropRect,
  targetWidth: number,
  targetHeight: number,
  options?: {
    fillColor?: string;
    adjustments?: ImageAdjustments;
    stamp?: StampOptions;
  }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) throw new Error('Could not initialize 2D canvas context');

  // Fill background
  ctx.fillStyle = options?.fillColor || '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Enable high quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Draw cropped image region to target canvas dimensions
  ctx.drawImage(
    image,
    cropRect.x,
    cropRect.y,
    cropRect.width,
    cropRect.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Apply filters / adjustments if specified
  if (options?.adjustments) {
    applyImageFilters(ctx, targetWidth, targetHeight, options.adjustments);
  }

  // Draw Name/Date stamp if specified
  if (options?.stamp) {
    drawDateStamp(ctx, targetWidth, targetHeight, options.stamp);
  }

  return canvas;
}
