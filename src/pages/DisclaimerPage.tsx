import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <SEOHead
        title="Official Disclaimer - Sarkari Doc Prep (Exam Snap)"
        description="Important statutory clarification that Exam Snap is an independent utility and is not an agency of the Indian Government."
      />

      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-extrabold text-navy">Official Disclaimer</h1>
        <p className="text-xs text-gray-500 mt-1">Statutory Notice to all Users</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed space-y-1">
          <strong className="font-bold text-sm">Non-Government Entity Declaration:</strong>
          <p>
            Exam Snap / Sarkari Doc Prep is a privately developed software application and is <strong>NOT affiliated with, authorized by, associated with, or in any way officially connected to the Government of India</strong>, the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Board (RRB), Institute of Banking Personnel Selection (IBPS), National Testing Agency (NTA), or any state government department.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h2 className="text-base font-bold text-navy">Purpose of Service</h2>
        <p>
          Exam Snap provides digital image resizing, cropping, compression, and PDF optimization tools to assist candidates in complying with digital upload parameters. Exam Snap does NOT submit examination forms, issue admit cards, or provide recruitment services.
        </p>

        <h2 className="text-base font-bold text-navy">No Guarantee of Application Acceptance</h2>
        <p>
          While ExamSnap strictly formats files to the dimensions, DPI, and file size parameters prescribed in official examination notifications, <strong>we do NOT guarantee that any government authority or examination portal will accept an application</strong>. Scrutiny and final acceptance of photographs, signatures, and certificates remain entirely at the sole discretion of the respective examining body.
        </p>

        <h2 className="text-base font-bold text-navy">Preset Verification Notice</h2>
        <p>
          Specifications provided in presets are collected from publicly released official notifications. Each verified preset displays its source notification link and verification date. Users are strongly advised to double-check their official examination advertisement.
        </p>
      </div>
    </div>
  );
};
