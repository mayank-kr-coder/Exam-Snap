import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck2, Shield, Heart, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-gray-300 pt-12 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <FileCheck2 className="w-5 h-5 text-saffron" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Exam<span className="text-saffron">Snap</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sarkari Doc Prep is a dedicated document utility platform engineered for Indian competitive examination aspirants (SSC, UPSC, Railways, Banking & State PSCs).
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-md w-fit">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side • Zero Cloud Uploads</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Essential Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tools/passport-photo-resizer" className="hover:text-saffron transition">
                  Passport Photo Resizer
                </Link>
              </li>
              <li>
                <Link to="/tools/signature-resizer" className="hover:text-saffron transition">
                  Signature Resizer (20KB)
                </Link>
              </li>
              <li>
                <Link to="/tools/photo-compressor" className="hover:text-saffron transition">
                  Photo Compressor (50KB)
                </Link>
              </li>
              <li>
                <Link to="/tools/date-stamp-tool" className="hover:text-saffron transition">
                  Date Stamp on Photo
                </Link>
              </li>
              <li>
                <Link to="/tools/thumb-impression-resizer" className="hover:text-saffron transition">
                  Thumb Impression Resizer
                </Link>
              </li>
              <li>
                <Link to="/tools/pdf-compressor" className="hover:text-saffron transition">
                  PDF Compressor for Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Exam Presets */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Exam Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tools/ssc-photo-resizer" className="hover:text-saffron transition">
                  SSC CGL / CHSL / MTS Specs
                </Link>
              </li>
              <li>
                <Link to="/tools/upsc-photo-resizer" className="hover:text-saffron transition">
                  UPSC CSE & NDA Formats
                </Link>
              </li>
              <li>
                <Link to="/tools/railway-photo-resizer" className="hover:text-saffron transition">
                  RRB NTPC & Group D
                </Link>
              </li>
              <li>
                <Link to="/presets" className="hover:text-saffron transition">
                  IBPS PO & SBI Bank Uploads
                </Link>
              </li>
              <li>
                <Link to="/presets" className="hover:text-saffron transition">
                  State PSC / UPSSSC / BPSC
                </Link>
              </li>
              <li>
                <Link to="/batch-dossier" className="text-saffron font-medium hover:underline flex items-center gap-1">
                  <span>Batch Dossier Pack (₹29)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy-policy" className="hover:text-saffron transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-saffron transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-saffron transition">
                  Official Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-saffron transition">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-white transition flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="border-t border-navy-800 pt-6 pb-4 text-[11px] text-gray-400 leading-relaxed text-center sm:text-left">
          <p>
            <strong className="text-gray-300">Disclaimer:</strong> ExamSnap / Sarkari Doc Prep is an independent document utility and is not affiliated with, endorsed by, or associated with the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Board (RRB), IBPS, or any government body. All registered trademarks and logos belong to their respective authorities. Presets are maintained as community guidelines; candidates should always refer to the official exam notifications.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
          <p>© 2026 Sarkari Doc Prep. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with privacy for aspirants across India
          </p>
        </div>
      </div>
    </footer>
  );
};
