import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { 
  FileCheck2, 
  ShieldCheck, 
  Sliders, 
  Download, 
  Upload, 
  Sparkles,
  ArrowRight,
  Smartphone,
  Cpu
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEOHead
        title="How It Works - Offline Client-Side Document Processing"
        description="Learn how Sarkari Doc Prep processes, crops, and compresses your examination documents directly in your browser without uploading to any servers."
      />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-saffron-dark bg-saffron/10 px-3 py-1 rounded-full border border-saffron/20">
          Architecture & Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy">
          How ExamSnap Prepares Your Documents
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Engineered for privacy, speed, and 100% adherence to Indian government examination portal upload requirements.
        </p>
      </div>

      {/* 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy">1. Local In-Browser Processing</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Unlike other file converter sites that upload your photos to remote cloud servers, ExamSnap leverages the HTML5 Canvas API and WebAssembly. Your images never leave your mobile phone or computer.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-saffron-dark flex items-center justify-center font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy">2. Binary Search Compression</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Govt portals strictly reject files outside min-max KB boundaries (e.g. 20KB to 50KB). Our engine runs an iterative binary search across JPEG quantization tables to guarantee your file lands strictly inside the allowed range.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy">3. Verified Official Presets</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We maintain verified specifications directly referenced from official recruitment notices (SSC, UPSC, RRB, IBPS). When an authority changes their upload rules, the preset is updated without touching your files.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-navy">4. Mobile Touch & Camera Friendly</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Snap a quick photo with your phone camera against any wall. You can drag and pinch to crop with your fingers, whiten paper backgrounds, and download instant JPEGs.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy text-white rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Ready to Prepare Your Application?</h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
          Start with our free passport photo resizer or signature optimizer.
        </p>
        <Link
          to="/tools/passport-photo-resizer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron hover:bg-saffron-light text-navy-900 font-bold text-xs transition shadow-sm"
        >
          <span>Start Preparing Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
