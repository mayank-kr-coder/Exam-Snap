import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileCheck2, 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  Crown, 
  Layers, 
  Lock,
  ChevronDown
} from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isPremium, openPaymentModal } = usePayment();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/tools' },
    { name: 'Exam Presets', path: '/presets' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      {/* Top micro banner for privacy assurance */}
      <div className="bg-navy text-white text-[11px] py-1 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Shield className="w-3 h-3 text-saffron" />
        <span>100% Client-Side Privacy: Your photos and signatures never leave your device</span>
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
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'text-navy bg-gray-100 font-semibold'
                    : 'text-gray-600 hover:text-navy hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Batch Processing Free CTA */}
            <Link
              to="/batch-dossier"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-brand-blue bg-saffron/15 hover:bg-saffron/25 border border-saffron/40 px-3 py-1.5 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
              <span>Batch Dossier (Free)</span>
            </Link>

            {/* Quick Start Tool CTA */}
            <Link
              to="/tools/passport-photo-resizer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-navy hover:bg-navy-800 shadow-sm transition active:scale-95"
            >
              Start Preparing
            </Link>

            {/* Admin icon */}
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
              className="p-1.5 text-gray-400 hover:text-navy rounded-lg hover:bg-gray-100 transition"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
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
        <div className="sm:hidden border-b border-brand-border bg-white px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'text-navy bg-gray-100 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link
              to="/tools/passport-photo-resizer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-navy"
            >
              Start Preparing Documents
            </Link>

            <Link
              to="/batch-dossier"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-navy bg-saffron/20 border border-saffron/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-saffron-dark" />
              <span>Batch Dossier Studio (100% Free)</span>
            </Link>

            <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1 hover:text-navy"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
              <span>Offline Ready</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
