# Exam Snap — Sarkari Doc Prep
> **"Your Documents. Perfectly Exam-Ready."**  
> *Resize, crop, compress and prepare your exam documents in seconds. 100% Free, Private, and Client-Side.*

Exam Snap (Sarkari Doc Prep) is a modern, responsive SaaS web application tailored for Indian competitive examination candidates (SSC, UPSC, Railway Recruitment, Banking, State PSCs, and National Testing Agency admissions).

---

## 🚀 Key Features & Functional Tools

### 1. Functional Browser-Side Image Processing
All image and PDF processing occurs **100% locally on your device** via HTML5 Canvas, WebAssembly, and `pdf-lib`. No photos or signatures are ever sent to external cloud servers.

1. **Passport Photo Resizer**:
   - Aspect ratio locking (3.5 × 4.5 cm / 350 × 350 px / custom).
   - Dimension controls in pixels or centimeters with configurable DPI (200 / 300 DPI).
   - Built-in biometric Face & Eye alignment guide oval.
   - Iterative JPEG compression (20KB–50KB).

2. **Signature Resizer & Paper Whitener**:
   - Removes shadows and wrinkled paper discoloration.
   - Deepens pen ink strokes (black or blue) for rejection-free scrutiny.
   - Strict 10KB–20KB file size targeting.

3. **Photo Compressor (Binary Search Iterative Engine)**:
   - Accurately hits target KB limits (e.g., max 50KB or 20KB) through binary search over JPEG quality factors.
   - Live visual comparison with original and compressed metrics.

4. **Background Tone & Cleaner**:
   - Browser-side edge & color threshold sampling to convert backgrounds to pure white (`#FFFFFF`) or studio off-white (`#F0F4F8`).

5. **Date & Name Stamp Tool**:
   - Prints candidate full name and Date of Photograph (DOP) on a high-contrast white bottom banner according to official SSC and UPSSSC guidelines.

6. **Thumb Impression Resizer (LTI)**:
   - Enhances ink ridge contrast and whitens paper for banking (IBPS, SBI PO) and railway portals.

7. **PDF Compressor for Certificates**:
   - Browser-based optimization of 10th marksheets, caste, EWS, and domicile certificates using `pdf-lib` stream compression and metadata stripping (&lt; 200KB).

8. **Image to JPG Converter**:
   - Converts transparent PNGs, screenshots, and WebP files to standard JPEG format.

9. **Photo Cropper**:
   - Touch and desktop crop adjustments with aspect ratio presets (1:1, 3.5:4.5, 4:2, freeform).

10. **Batch Exam Dossier Studio (Premium Pack - ₹29)**:
    - 1-click batch document preparation: Photo + Signature + Thumb Impression formatted simultaneously.

---

## 🏛️ Configurable Exam Preset System

Presets are not hardcoded guesses; each preset displays:
- **Verified Status**: Verified against recruitment advertisements or clearly marked as *"Demo – Verify Official Notification"*.
- **Verification Date**: Date of last notification check.
- **Source Link**: Direct link to official commission portals (e.g., `ssc.gov.in`, `upsc.gov.in`, `ibps.in`).
- **Dynamic Configuration**: Official presets can be updated and managed via the Protected Admin Dashboard without rebuilding the core processing engine.

---

## 🔐 Protected Admin Dashboard

Accessible at `/admin`:
- **Authentication**: Secure credential session check (demo: `admin@examsnap.in` / `Admin@ExamSnap2026!`).
- **Preset Management**: Add, edit, verify, or remove exam specifications.
- **Pricing Management**: Modify Exam Pack price (default: ₹29) and availability.
- **Usage Statistics**: View total prepared documents and bandwidth saved.

---

## 💳 Razorpay Payment Gateway Architecture

Designed following secure zero-trust principles:
- **Client Key**: Configured via `VITE_RAZORPAY_KEY_ID`.
- **Zero Secret Exposure**: Razorpay secret keys are never included in frontend client bundles.
- **Backend Signature Verification**: Orders are initiated via server REST endpoints and verified via HMAC-SHA256 signature verification.
- **Sandbox Fallback**: If credentials are not set, a clearly labelled integration placeholder is displayed without simulating fake payments.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS, Lucide React icons
- **Processing**: HTML5 Canvas API, `pdf-lib`, `canvas-confetti`
- **Routing**: React Router 7
- **Design Inspiration**: Linear, Stripe, and modern Indian productivity platforms.

---

## 💻 Installation & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### Quick Start
```bash
# Clone or navigate to the repository
cd exam

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Optional: Razorpay Client Key for live/test checkout
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here

# App URL for SEO & OpenGraph tags
VITE_APP_URL=https://examsnap.in
```

---

## 📦 Production Build & Deployment

```bash
# Run TypeScript type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

### Static Host Deployment (Vercel, Netlify, Cloudflare Pages, S3)
The `dist/` directory contains standard static assets:
- For single-page app routing on Netlify/Vercel, a rewrite from `/*` to `/index.html` is configured.
- `public/robots.txt` and `public/sitemap.xml` are automatically included in the build.

---

## ⚖️ Legal & Privacy Disclaimer

*Exam Snap (Sarkari Doc Prep) is an independent document utility and is NOT affiliated with, endorsed by, or connected to the Government of India, the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Board (RRB), IBPS, or any government agency. All trademarks belong to their respective authorities.*
