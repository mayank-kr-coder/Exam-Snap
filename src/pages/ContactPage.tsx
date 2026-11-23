import React, { useState } from 'react';
import { SEOHead } from '../components/common/SEOHead';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SEOHead
        title="Contact Support - Exam Snap (Sarkari Doc Prep)"
        description="Contact Exam Snap support team for help with exam document requirements, feedback, or technical queries."
      />

      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-navy">Contact & Aspirant Support</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Have a question about document specifications or need help with your exam upload? Reach out anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 bg-navy text-white rounded-2xl p-6 space-y-5">
          <h3 className="font-bold text-base text-saffron">Aspirant Help Desk</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            Our team actively monitors changes in SSC, UPSC, IBPS, and State PSC notifications to keep our presets up to date.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 text-saffron" />
              <span>support@examsnap.in</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MessageSquare className="w-4 h-4 text-saffron" />
              <span>Response time: Under 12 hours</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white rounded-2xl border border-brand-border p-6 shadow-subtle">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base text-navy">Message Received!</h3>
              <p className="text-xs text-gray-500">
                Thank you for reaching out. Our team will review your query and reply to {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  placeholder="e.g. Mayank Sharma"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  placeholder="candidate@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Examination</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  placeholder="e.g. SSC CGL 2026 / UPSC CSE"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  placeholder="Describe your issue or query..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-navy hover:bg-navy-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-saffron" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
