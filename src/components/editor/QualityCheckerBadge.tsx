import React, { useState, useEffect } from 'react';
import { 
  analyzeImageQuality, 
  ImageQualityReport 
} from '../../utils/imageProcessing';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Focus, 
  Maximize,
  ShieldCheck
} from 'lucide-react';

interface QualityCheckerBadgeProps {
  image: HTMLImageElement | null;
  className?: string;
}

export const QualityCheckerBadge: React.FC<QualityCheckerBadgeProps> = ({ image, className = '' }) => {
  const [report, setReport] = useState<ImageQualityReport | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (!image) {
      setReport(null);
      return;
    }
    try {
      const rep = analyzeImageQuality(image);
      setReport(rep);
    } catch (e) {
      // ignore
    }
  }, [image]);

  if (!report) return null;

  const getStatusColor = (status: ImageQualityReport['status']) => {
    switch (status) {
      case 'excellent':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle2
        };
      case 'good':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-600 text-white',
          icon: CheckCircle2
        };
      case 'fair':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          badge: 'bg-amber-500 text-white',
          icon: AlertTriangle
        };
      case 'poor':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          badge: 'bg-rose-600 text-white',
          icon: XCircle
        };
    }
  };

  const style = getStatusColor(report.status);
  const StatusIcon = style.icon;

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} p-3 transition shadow-xs ${className}`}>
      {/* Top Summary Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${style.text}`} />
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${style.text}`}>
              Photo Quality: {report.score}/100 ({report.status.toUpperCase()})
            </span>
            <span className="text-[10px] text-gray-500">
              {report.isSharp ? '• Sharp & Clear' : '• Soft Focus'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-1 text-[11px] font-semibold ${style.text} hover:opacity-80 transition`}
        >
          <span>{expanded ? 'Hide Details' : 'View Quality Checks'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Metrics Checklist */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200/60 space-y-2.5 text-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/80 p-2 rounded-lg border border-gray-200/80 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                <Focus className="w-3 h-3" />
                <span className="text-[10px]">Sharpness</span>
              </div>
              <span className={`font-mono font-bold text-xs ${report.isSharp ? 'text-emerald-700' : 'text-amber-700'}`}>
                {report.sharpnessScore}/100
              </span>
            </div>

            <div className="bg-white/80 p-2 rounded-lg border border-gray-200/80 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                <Sun className="w-3 h-3" />
                <span className="text-[10px]">Lighting</span>
              </div>
              <span className={`font-mono font-bold text-xs ${report.isLightingAdequate ? 'text-emerald-700' : 'text-amber-700'}`}>
                {report.averageBrightness} / 255
              </span>
            </div>

            <div className="bg-white/80 p-2 rounded-lg border border-gray-200/80 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                <Maximize className="w-3 h-3" />
                <span className="text-[10px]">Resolution</span>
              </div>
              <span className={`font-mono font-bold text-xs ${report.isResolutionAdequate ? 'text-emerald-700' : 'text-rose-700'}`}>
                {image ? `${image.naturalWidth}×${image.naturalHeight}` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Issues if any */}
          {report.issues.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-rose-700 block">Needs Attention:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-700">
                {report.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Practical Tips */}
          {report.tips.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-navy block">Exam Upload Guidelines:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-600">
                {report.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
