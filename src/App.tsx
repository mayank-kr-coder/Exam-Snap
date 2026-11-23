import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RazorpayModal } from './components/modals/RazorpayModal';

import { ExamPresetProvider } from './context/ExamPresetContext';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';

// Pages
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { ExamPresetsPage } from './pages/ExamPresetsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PricingPage } from './pages/PricingPage';
import { FAQPage } from './pages/FAQPage';
import { BatchDossierPage } from './pages/BatchDossierPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { SEOToolLandingPage } from './pages/SEOToolLandingPage';

// Legal & Trust
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ContactPage } from './pages/ContactPage';

// Functional Tools
import { PassportPhotoTool } from './tools/PassportPhotoTool';
import { SignatureResizerTool } from './tools/SignatureResizerTool';
import { ImageCompressorTool } from './tools/ImageCompressorTool';
import { BackgroundChangerTool } from './tools/BackgroundChangerTool';
import { DateStampTool } from './tools/DateStampTool';
import { ThumbImpressionTool } from './tools/ThumbImpressionTool';
import { PdfCompressorTool } from './tools/PdfCompressorTool';
import { ImageToJpgTool } from './tools/ImageToJpgTool';
import { PhotoCropperTool } from './tools/PhotoCropperTool';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ExamPresetProvider>
        <AuthProvider>
          <PaymentProvider>
            <div className="min-h-screen flex flex-col bg-brand-lightBg text-brand-dark selection:bg-saffron selection:text-navy">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Home & General Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tools" element={<AllToolsPage />} />
                  <Route path="/presets" element={<ExamPresetsPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/batch-dossier" element={<BatchDossierPage />} />

                  {/* Individual Tools */}
                  <Route path="/tools/passport-photo-resizer" element={<PassportPhotoTool />} />
                  <Route path="/tools/signature-resizer" element={<SignatureResizerTool />} />
                  <Route path="/tools/photo-compressor" element={<ImageCompressorTool />} />
                  <Route path="/tools/background-changer" element={<BackgroundChangerTool />} />
                  <Route path="/tools/date-stamp-tool" element={<DateStampTool />} />
                  <Route path="/tools/thumb-impression-resizer" element={<ThumbImpressionTool />} />
                  <Route path="/tools/pdf-compressor" element={<PdfCompressorTool />} />
                  <Route path="/tools/image-to-jpg" element={<ImageToJpgTool />} />
                  <Route path="/tools/photo-cropper" element={<PhotoCropperTool />} />

                  {/* Dedicated SEO Landing Pages (e.g. /tools/ssc-photo-resizer, /tools/upsc-photo-resizer, /tools/railway-photo-resizer) */}
                  <Route path="/tools/:toolSlug" element={<SEOToolLandingPage />} />

                  {/* Admin Portal */}
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />

                  {/* Trust & Legal */}
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/disclaimer" element={<DisclaimerPage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />

              {/* Global Razorpay Payment Modal */}
              <RazorpayModal />
            </div>
          </PaymentProvider>
        </AuthProvider>
      </ExamPresetProvider>
    </BrowserRouter>
  );
};

export default App;
