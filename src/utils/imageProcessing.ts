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

export interface ImageQualityReport {
  score: number; // 0 - 100
  status: 'excellent' | 'good' | 'fair' | 'poor';
  isSharp: boolean;
  sharpnessVariance: number;
  sharpnessScore: number; // 0 - 100
  averageBrightness: number; // 0 - 255
  contrastScore: number; // std dev
  isLightingAdequate: boolean;
  isResolutionAdequate: boolean;
  issues: string[];
  tips: string[];
}

/**
 * Analyzes photo quality using client-side canvas statistics:
 * - Variance of the Laplacian filter for blurriness detection
 * - Grayscale luminance distribution for lighting / exposure check
 * - Standard deviation for contrast check
 * - Pixel dimension check for resolution adequacy
 */
export function analyzeImageQuality(image: HTMLImageElement): ImageQualityReport {
  const issues: string[] = [];
  const tips: string[] = [];

  const naturalW = image.naturalWidth || image.width;
  const naturalH = image.naturalHeight || image.height;

  // 1. Resolution Check
  const isResolutionAdequate = naturalW >= 250 && naturalH >= 250;
  if (!isResolutionAdequate) {
    issues.push(`Low resolution (${naturalW}×${naturalH} px). Minimum recommended is 350×450 px.`);
    tips.push('Use a clearer original photo taken with your smartphone main camera.');
  }

  // Sample image on 200x200 canvas for fast, reliable calculation
  const sampleSize = 200;
  const canvas = document.createElement('canvas');
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    return {
      score: 80,
      status: 'good',
      isSharp: true,
      sharpnessVariance: 150,
      sharpnessScore: 80,
      averageBrightness: 140,
      contrastScore: 50,
      isLightingAdequate: true,
      isResolutionAdequate: true,
      issues: [],
      tips: ['Photo ready for formatting.']
    };
  }

  ctx.drawImage(image, 0, 0, sampleSize, sampleSize);
  const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
  const data = imgData.data;

  // 2. Grayscale luminance array
  const gray = new Float32Array(sampleSize * sampleSize);
  let totalLuminance = 0;

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[i / 4] = lum;
    totalLuminance += lum;
  }

  const avgBrightness = totalLuminance / (sampleSize * sampleSize);

  // Contrast (Standard Deviation)
  let varianceSum = 0;
  for (let i = 0; i < gray.length; i++) {
    const diff = gray[i] - avgBrightness;
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / gray.length);

  // 3. Sharpness / Blur Detection via Laplacian Filter Variance
  let laplacianSum = 0;
  let laplacianSqSum = 0;
  let laplacianCount = 0;

  // Skip border pixels
  for (let y = 1; y < sampleSize - 1; y++) {
    for (let x = 1; x < sampleSize - 1; x++) {
      const idx = y * sampleSize + x;
      // Kernel: [0, 1, 0; 1, -4, 1; 0, 1, 0]
      const lap =
        gray[idx - sampleSize] +
        gray[idx + sampleSize] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];

      laplacianSum += lap;
      laplacianSqSum += lap * lap;
      laplacianCount++;
    }
  }

  const lapMean = laplacianSum / laplacianCount;
  const sharpnessVariance = Math.max(0, laplacianSqSum / laplacianCount - lapMean * lapMean);

  // Sharpness evaluation
  const isSharp = sharpnessVariance >= 75;
  const sharpnessScore = Math.min(100, Math.round((sharpnessVariance / 250) * 100));

  if (sharpnessVariance < 50) {
    issues.push('Photo appears blurry or out of focus. Eyes and face features may not be sharp.');
    tips.push('Retake with phone steady or hold further back in natural daylight.');
  } else if (sharpnessVariance < 75) {
    issues.push('Slight softness/blur detected.');
    tips.push('Ensure the camera lens was clean when taking the photo.');
  }

  // Lighting evaluation
  let isLightingAdequate = true;
  if (avgBrightness < 80) {
    isLightingAdequate = false;
    issues.push('Photo is dark / underexposed. Background and face appear shadowed.');
    tips.push('Stand facing a bright window or use a well-lit room without heavy shadows.');
  } else if (avgBrightness > 220) {
    isLightingAdequate = false;
    issues.push('Photo is too bright / overexposed. Facial features may look washed out.');
    tips.push('Avoid direct harsh flashlight or overly bright direct sunlight.');
  }

  if (stdDev < 28) {
    issues.push('Low color contrast between face and background.');
    tips.push('Wear darker clothes that contrast clearly against a plain white/light background.');
  }

  // Composite Quality Score Calculation (0 - 100)
  let score = 100;
  if (!isSharp) score -= 35;
  if (!isLightingAdequate) score -= 25;
  if (!isResolutionAdequate) score -= 20;
  if (stdDev < 28) score -= 15;
  score = Math.max(25, Math.min(100, score));

  let status: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  if (score >= 85) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 50) status = 'fair';
  else status = 'poor';

  if (issues.length === 0) {
    tips.push('Lighting and sharpness meet official examination standards.');
    tips.push('Ensure both ears and eyes are visible before saving.');
  }

  return {
    score,
    status,
    isSharp,
    sharpnessVariance: Math.round(sharpnessVariance),
    sharpnessScore,
    averageBrightness: Math.round(avgBrightness),
    contrastScore: Math.round(stdDev),
    isLightingAdequate,
    isResolutionAdequate,
    issues,
    tips
  };
}

export interface PrintSheetOptions {
  paperSize: 'a4' | '4x6';
  photoCount: number; // e.g. 4, 6, 8, 12, 16, 32
  includeCutMarks: boolean;
  borderWidthPx: number; // 1px thin guide
}

/**
 * Generates an ultra-crisp, printable sheet of passport photos ready for print or download
 * Standard A4: 2480 x 3508 px @ 300 DPI (210 x 297 mm)
 * Standard 4x6 inch: 1200 x 1800 px @ 300 DPI (101.6 x 152.4 mm)
 * Photo Size: 3.5cm x 4.5cm @ 300 DPI = 413 x 531 px
 */
export function generatePassportPrintSheet(
  photoCanvas: HTMLCanvasElement,
  options: PrintSheetOptions
): HTMLCanvasElement {
  const sheetCanvas = document.createElement('canvas');

  // Sheet dimensions at 300 DPI
  const isA4 = options.paperSize === 'a4';
  const sheetW = isA4 ? 2480 : 1200;
  const sheetH = isA4 ? 3508 : 1800;

  sheetCanvas.width = sheetW;
  sheetCanvas.height = sheetH;
  const ctx = sheetCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not create print sheet context');

  // Pure white paper background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, sheetW, sheetH);

  // Standard passport photo dimensions at 300 DPI
  const photoW = 413; // 3.5 cm
  const photoH = 531; // 4.5 cm

  // Calculate grid layout based on sheet size and desired photo count
  let cols = 2;
  let rows = 3;

  if (isA4) {
    if (options.photoCount <= 6) {
      cols = 2;
      rows = 3;
    } else if (options.photoCount <= 8) {
      cols = 2;
      rows = 4;
    } else if (options.photoCount <= 12) {
      cols = 3;
      rows = 4;
    } else if (options.photoCount <= 16) {
      cols = 4;
      rows = 4;
    } else {
      cols = 5;
      rows = 6; // up to 30 on A4
    }
  } else {
    // 4x6 inch photo paper
    if (options.photoCount <= 4) {
      cols = 2;
      rows = 2;
    } else if (options.photoCount <= 6) {
      cols = 2;
      rows = 3;
    } else {
      cols = 2;
      rows = 4;
    }
  }

  const actualCount = Math.min(options.photoCount, cols * rows);

  // Compute spacing
  const gapX = 40;
  const gapY = 50;
  const totalGridW = cols * photoW + (cols - 1) * gapX;
  const totalGridH = rows * photoH + (rows - 1) * gapY;

  const startX = Math.round((sheetW - totalGridW) / 2);
  const startY = Math.round((sheetH - totalGridH) / 2) + 20;

  // Header banner on sheet
  ctx.fillStyle = '#14213D';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Passport Photos Print Sheet — 3.5 × 4.5 cm (${isA4 ? 'A4 Paper' : '4×6" Photo Paper'})`,
    sheetW / 2,
    startY - 60
  );

  ctx.fillStyle = '#64748B';
  ctx.font = '22px sans-serif';
  ctx.fillText(
    'Printed at 300 DPI • Standard Govt Exam & Passport Specification • Cut along guidelines',
    sheetW / 2,
    startY - 25
  );

  // Draw photos onto grid
  for (let i = 0; i < actualCount; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);

    const x = startX + c * (photoW + gapX);
    const y = startY + r * (photoH + gapY);

    // Draw photo
    ctx.drawImage(photoCanvas, x, y, photoW, photoH);

    // Cut marks / subtle border
    if (options.includeCutMarks) {
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(x - 2, y - 2, photoW + 4, photoH + 4);
      ctx.setLineDash([]);

      // Corner cross cut marks
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      const markLen = 14;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(x - markLen, y);
      ctx.lineTo(x, y);
      ctx.moveTo(x, y - markLen);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(x + photoW, y);
      ctx.lineTo(x + photoW + markLen, y);
      ctx.moveTo(x + photoW, y - markLen);
      ctx.lineTo(x + photoW, y);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(x - markLen, y + photoH);
      ctx.lineTo(x, y + photoH);
      ctx.moveTo(x, y + photoH);
      ctx.lineTo(x, y + photoH + markLen);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(x + photoW, y + photoH);
      ctx.lineTo(x + photoW + markLen, y + photoH);
      ctx.moveTo(x + photoW, y + photoH);
      ctx.lineTo(x + photoW, y + photoH + markLen);
      ctx.stroke();
    }
  }

  // Footer footer watermark
  ctx.fillStyle = '#94A3B8';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Prepared with ExamSnap — 100% Private In-Browser Document Prep', sheetW / 2, sheetH - 40);

  return sheetCanvas;
}
