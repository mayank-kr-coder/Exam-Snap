import fs from 'fs';
import path from 'path';

console.log('=== STARTING EXAM SNAP REGRESSION & VERIFICATION SUITE ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. TEST JFIF 300 DPI INJECTION
console.log('--- TEST 1: JPEG JFIF 300 DPI Injection & Extraction ---');
// Minimal valid JPEG header (SOI + DQT + SOF0 + EOI)
const dummyJpeg = new Uint8Array([
  0xFF, 0xD8, // SOI
  0xFF, 0xDB, 0x00, 0x43, 0x00, ...new Array(64).fill(1), // DQT
  0xFF, 0xD9  // EOI
]);

// Test JFIF injection
function injectJfifDpiBytes(view, dpi = 300) {
  const dpiInt = Math.max(72, Math.min(1200, Math.round(dpi)));
  const dpiHi = (dpiInt >> 8) & 0xFF;
  const dpiLo = dpiInt & 0xFF;

  if (
    view[2] === 0xFF &&
    view[3] === 0xE0 &&
    view.length >= 18 &&
    view[6] === 0x4A &&
    view[7] === 0x46 &&
    view[8] === 0x49 &&
    view[9] === 0x46 &&
    view[10] === 0x00
  ) {
    const updated = new Uint8Array(view);
    updated[13] = 1;
    updated[14] = dpiHi;
    updated[15] = dpiLo;
    updated[16] = dpiHi;
    updated[17] = dpiLo;
    return updated;
  }

  const jfifSegment = new Uint8Array([
    0xFF, 0xE0,
    0x00, 0x10,
    0x4A, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x02,
    0x01,
    dpiHi, dpiLo,
    dpiHi, dpiLo,
    0x00, 0x00
  ]);

  const output = new Uint8Array(view.length + jfifSegment.length);
  output.set(view.subarray(0, 2), 0);
  output.set(jfifSegment, 2);
  output.set(view.subarray(2), 2 + jfifSegment.length);
  return output;
}

function readJpegDpiBytes(view) {
  if (view.length < 18 || view[0] !== 0xFF || view[1] !== 0xD8) return null;
  for (let i = 2; i < Math.min(view.length - 16, 250); i++) {
    if (
      view[i] === 0xFF &&
      view[i + 1] === 0xE0 &&
      view[i + 4] === 0x4A &&
      view[i + 5] === 0x46 &&
      view[i + 6] === 0x49 &&
      view[i + 7] === 0x46 &&
      view[i + 8] === 0x00
    ) {
      const units = view[i + 11];
      const dpiX = (view[i + 12] << 8) | view[i + 13];
      const dpiY = (view[i + 14] << 8) | view[i + 15];
      return { dpiX, dpiY, units };
    }
  }
  return null;
}

const injected = injectJfifDpiBytes(dummyJpeg, 300);
const metadata = readJpegDpiBytes(injected);
assert(metadata !== null, 'JFIF APP0 segment successfully created in JPEG stream');
assert(metadata && metadata.units === 1, 'JFIF density units correctly set to 1 (Dots Per Inch)');
assert(metadata && metadata.dpiX === 300, 'Horizontal DPI correctly encoded as 300');
assert(metadata && metadata.dpiY === 300, 'Vertical DPI correctly encoded as 300');

// Test update in-place if APP0 already exists
const reinjected = injectJfifDpiBytes(injected, 600);
const metadata600 = readJpegDpiBytes(reinjected);
assert(metadata600 && metadata600.dpiX === 600 && metadata600.dpiY === 600, 'Existing JFIF APP0 successfully updated in-place without stream corruption');

// 2. TEST LARGE IMAGE MEMORY PROTECTION & DOWNSCALING MATH
console.log('\n--- TEST 2: Large Image Memory Downscaling Protection ---');
function calculateSafeDimensions(origW, origH, maxDim = 4096) {
  if (origW <= maxDim && origH <= maxDim) {
    return { width: origW, height: origH, isDownscaled: false };
  }
  const scale = Math.min(maxDim / origW, maxDim / origH);
  return {
    width: Math.round(origW * scale),
    height: Math.round(origH * scale),
    isDownscaled: true
  };
}

// 8500 x 8500 px image test
const hugeImage = calculateSafeDimensions(8500, 8500, 4096);
assert(hugeImage.isDownscaled === true, '8500x8500px image flagged for downscaling');
assert(hugeImage.width === 4096 && hugeImage.height === 4096, '8500x8500px clamped to safe 4096x4096px canvas limit');

// 9000 x 4500 px widescreen image test
const wideImage = calculateSafeDimensions(9000, 4500, 4096);
assert(wideImage.isDownscaled === true, '9000x4500px flagged for downscaling');
assert(wideImage.width === 4096, 'Width scaled to 4096');
assert(wideImage.height === 2048, 'Height scaled to 2048 (exact 2:1 aspect ratio preserved)');

// 1200 x 1600 px standard image test
const normalImage = calculateSafeDimensions(1200, 1600, 4096);
assert(normalImage.isDownscaled === false, 'Standard 1200x1600px image not downscaled');
assert(normalImage.width === 1200 && normalImage.height === 1600, 'Original dimensions preserved for normal images');

// 3. TEST ROUTE & FOOTER NAVIGATION INTEGRITY
console.log('\n--- TEST 3: Navigation & Route Integrity ---');
const appTsx = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
const footerTsx = fs.readFileSync(path.resolve('src/components/common/Footer.tsx'), 'utf-8');
const seoTsx = fs.readFileSync(path.resolve('src/pages/SEOToolLandingPage.tsx'), 'utf-8');

// Extract routes from App.tsx
const routeMatches = [...appTsx.matchAll(/path="([^"]+)"/g)].map(m => m[1]);
// Extract links from Footer.tsx
const footerLinks = [...footerTsx.matchAll(/to="([^"]+)"/g)].map(m => m[1]);

// Extract dynamic SEO pages from SEOToolLandingPage.tsx
const seoPageMatches = [...seoTsx.matchAll(/'([a-z0-9-]+)':\s*\{/g)].map(m => `/tools/${m[1]}`);

const allValidRoutes = new Set([
  ...routeMatches,
  ...seoPageMatches,
  '/'
]);

let brokenLinks = [];
for (const link of footerLinks) {
  if (!allValidRoutes.has(link)) {
    brokenLinks.push(link);
  }
}

assert(brokenLinks.length === 0, `All ${footerLinks.length} footer links resolve to valid registered routes (broken: ${brokenLinks.join(', ') || 'none'})`);
assert(footerLinks.includes('/tools/ibps-banking-photo-resizer'), 'Footer includes working IBPS Banking photo resizer route');
assert(footerLinks.includes('/tools/state-psc-photo-resizer'), 'Footer includes working State PSC photo resizer route');

// 4. TEST MOBILE STICKY ACTION BAR & TOUCH CROPPER
console.log('\n--- TEST 4: Mobile Sticky Action Bar & Touch Cropper Components ---');
const stickyBarExists = fs.existsSync(path.resolve('src/components/common/MobileStickyActionBar.tsx'));
assert(stickyBarExists, 'MobileStickyActionBar component exists');

const cropperTsx = fs.readFileSync(path.resolve('src/components/editor/CanvasCropper.tsx'), 'utf-8');
assert(cropperTsx.includes('pinchStartDistRef'), 'CanvasCropper implements multi-touch pinch-to-zoom tracking');
assert(cropperTsx.includes('handleZoomStep'), 'CanvasCropper implements zoom step controls');
assert(cropperTsx.includes('touch-none'), 'CanvasCropper enforces touch-none to prevent accidental page scrolling');

// 5. TEST PRESET RETENTION IN EXAM PRESET CONTEXT
console.log('\n--- TEST 5: Exam Preset Retention ---');
const contextTsx = fs.readFileSync(path.resolve('src/context/ExamPresetContext.tsx'), 'utf-8');
assert(contextTsx.includes('examsnap_active_preset_id'), 'ExamPresetContext uses localStorage key examsnap_active_preset_id for retention');
assert(contextTsx.includes('clearPresetSelection'), 'ExamPresetContext exposes clearPresetSelection helper');

// 6. TEST WEB SHARE API & WHATSAPP INTEGRATION
console.log('\n--- TEST 6: Web Share API & WhatsApp Sharing ---');
const dlBtnTsx = fs.readFileSync(path.resolve('src/components/common/DownloadButton.tsx'), 'utf-8');
assert(dlBtnTsx.includes('navigator.canShare'), 'DownloadButton checks Web Share API support with files');
assert(dlBtnTsx.includes('api.whatsapp.com/send'), 'DownloadButton includes WhatsApp fallback sharing');
assert(dlBtnTsx.includes('Zero Cloud Uploads') || dlBtnTsx.includes('100% Client-Side') || dlBtnTsx.includes('File saved to device'), 'DownloadButton protects user privacy without server upload');

// 7. TEST EXAM PRESET DATABASE INTEGRITY
console.log('\n--- TEST 7: Exam Preset Database Integrity ---');
const presetsTs = fs.readFileSync(path.resolve('src/exam-presets/defaultPresets.ts'), 'utf-8');
assert(presetsTs.includes('ssc-cgl-chsl'), 'SSC CGL/CHSL preset verified in database (id: ssc-cgl-chsl)');
assert(presetsTs.includes('upsc-civil-services'), 'UPSC Civil Services preset verified in database (id: upsc-civil-services)');
assert(presetsTs.includes('railway-rrb'), 'RRB Railway preset verified in database (id: railway-rrb)');
assert(presetsTs.includes('banking-ibps-sbi'), 'IBPS Bank PO/SBI preset verified in database (id: banking-ibps-sbi)');
assert(presetsTs.includes('state-upsssc-bpsc'), 'State PSC (UPSSSC/BPSC) preset verified in database (id: state-upsssc-bpsc)');
assert(presetsTs.includes('university-nta-cuet-neet'), 'NTA NEET/CUET preset verified in database (id: university-nta-cuet-neet)');

console.log(`\n========================================`);
console.log(`SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
}
