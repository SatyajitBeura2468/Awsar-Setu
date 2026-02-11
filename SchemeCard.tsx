import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Scheme } from './types';

interface SchemeCardProps {
  scheme: Scheme;
  onClick: (scheme: Scheme) => void;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onClick }) => {
  return (
    <div 
      onClick={() => onClick(scheme)}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <ArrowRight size={40} className="-rotate-45 text-brand-500" />
      </div>

      <div className="flex justify-between items-start mb-3">
        <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
          {scheme.type}
        </span>
        {scheme.provider && (
           <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
             {scheme.provider}
           </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
        {scheme.title}
      </h3>
      
      <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
        {scheme.description}
      </p>

      <div className="flex items-center text-brand-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
        View Details <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  );
};

export default SchemeCard;
