import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/common/SEOHead';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('admin@examsnap.in');
  const [password, setPassword] = useState('Admin@ExamSnap2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to admin dashboard
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <SEOHead
        title="Admin Portal Login"
        description="Secure administrator access for managing official exam presets, pricing, and system configurations."
      />

      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-navy text-saffron flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Administrator Sign In</h1>
          <p className="text-xs text-gray-500">
            Authenticate to access the preset verification engine and portal controls.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:outline-none"
                placeholder="admin@examsnap.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy focus:outline-none"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-navy hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying Session...</span>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 text-saffron" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Notice for Reviewers */}
        <div className="p-3 bg-brand-lightBg border border-gray-200 rounded-xl space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 font-bold text-navy text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evaluation Credentials:</span>
          </div>
          <p className="text-[11px] font-mono">Email: admin@examsnap.in</p>
          <p className="text-[11px] font-mono">Password: Admin@ExamSnap2026!</p>
        </div>
      </div>
    </div>
  );
};
