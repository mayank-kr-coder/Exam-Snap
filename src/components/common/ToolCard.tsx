import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  PenTool, 
  Minimize2, 
  FileMinus, 
  Paintbrush, 
  Calendar, 
  Fingerprint, 
  FileText, 
  RefreshCw, 
  Crop,
  ArrowRight
} from 'lucide-react';
import { ToolInfo } from '../../types/tool';

interface ToolCardProps {
  tool: ToolInfo;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Camera':
        return <Camera className="w-5 h-5 text-brand-blue" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-saffron-dark" />;
      case 'Minimize2':
        return <Minimize2 className="w-5 h-5 text-emerald-600" />;
      case 'FileMinus':
        return <FileMinus className="w-5 h-5 text-purple-600" />;
      case 'Paintbrush':
        return <Paintbrush className="w-5 h-5 text-pink-600" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-indigo-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-rose-600" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-teal-600" />;
      case 'Crop':
        return <Crop className="w-5 h-5 text-cyan-600" />;
      default:
        return <Camera className="w-5 h-5 text-navy" />;
    }
  };

  return (
    <Link
      to={tool.route}
      className="group bg-white rounded-2xl border border-brand-border p-5 hover:border-navy hover:shadow-card transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-lightBg flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-50 transition">
            {getIcon(tool.icon)}
          </div>
          {tool.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-saffron/15 text-saffron-dark border border-saffron/30">
              {tool.badge}
            </span>
          )}
        </div>

        <h3 className="font-bold text-base text-brand-dark group-hover:text-navy transition">
          {tool.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
          {tool.shortDesc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-navy group-hover:text-brand-blue">
        <span>Open Tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
      </div>
    </Link>
  );
};
