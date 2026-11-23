import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileCheck2, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Camera,
  PenTool,
  Minimize2,
  Calendar,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Photo Resizer', path: '/tools/passport-photo-resizer' },
    { name: 'Signature Resizer', path: '/tools/signature-resizer' },
    { name: 'Size Checker', path: '/tools/file-size-checker' },
    { name: 'A4 Print Sheet', path: '/tools/passport-photo-print-sheet' },
    { name: 'Batch Processor', path: '/tools/batch-processor' },
    { name: 'All Tools', path: '/tools' },
    { name: 'Exam Presets', path: '/presets' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      {/* Top reassurance bar */}
      <div className="bg-navy text-white text-[11px] py-1 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>100% Free Public Tool • Zero Server Uploads • Photos stay private on your phone/PC</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition">
              <FileCheck2 className="w-5 h-5 text-saffron" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-navy tracking-tight leading-none">
                Exam<span className="text-saffron">Snap</span>
              </span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
                Sarkari Doc Prep
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive(link.path)
                    ? 'text-navy bg-gray-100'
                    : 'text-gray-600 hover:text-navy hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/batch-dossier"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-navy bg-saffron/15 hover:bg-saffron/25 border border-saffron/40 px-3 py-1.5 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
              <span>All-in-One Dossier (Free)</span>
            </Link>

            <Link
              to="/tools/passport-photo-resizer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold text-white bg-navy hover:bg-navy-800 shadow-sm transition active:scale-95"
            >
              Start Formatting
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-navy hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-brand-border bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  isActive(link.path)
                    ? 'text-navy bg-gray-100'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link
              to="/batch-dossier"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-navy bg-saffron/20 border border-saffron/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
              <span>All-in-One Dossier Studio (Free)</span>
            </Link>

            <Link
              to="/tools/passport-photo-resizer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-navy"
            >
              Start Preparing Photo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
