import React, { useState } from 'react';
import { ToolCard } from '../components/common/ToolCard';
import { SEOHead } from '../components/common/SEOHead';
import { TOOLS_LIST } from './HomePage';
import { Search } from 'lucide-react';

export const AllToolsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'photo' | 'signature' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesFilter = filter === 'all' || tool.category === filter;
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="All Document Tools - Sarkari Doc Prep (Exam Snap)"
        description="Comprehensive list of photo resizers, signature compressors, date stamping tools, and PDF compressors for Indian government exam applicants."
      />

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy">
          All Exam Document Tools
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Pick a specialized utility to prepare your photos, signatures, thumb impressions, and certificates in seconds.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="flex bg-white rounded-xl p-1 border border-brand-border text-xs w-full sm:w-auto shadow-subtle">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'all' ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
            }`}
          >
            All Tools ({TOOLS_LIST.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('photo')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'photo' ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
            }`}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => setFilter('signature')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'signature' ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
            }`}
          >
            Signatures & Thumbs
          </button>
          <button
            type="button"
            onClick={() => setFilter('document')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'document' ? 'bg-navy text-white shadow-xs' : 'text-gray-600 hover:text-navy'
            }`}
          >
            PDF Certificates
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. 20kb, stamp)..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl bg-white shadow-subtle focus:outline-none focus:ring-2 focus:ring-navy"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
};
