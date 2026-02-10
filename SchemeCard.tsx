import React from 'react';
import { Scheme, SchemeType } from '../types';
import { ArrowRight, MapPin, Building2, ShieldCheck } from 'lucide-react';

interface SchemeCardProps {
  scheme: Scheme;
  onClick: (scheme: Scheme) => void;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onClick }) => {
  return (
    <div 
      onClick={() => onClick(scheme)}
      className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-500 to-brand-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
          scheme.type === SchemeType.CENTRAL 
            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
            : 'bg-orange-50 text-orange-700 border border-orange-100'
        }`}>
          {scheme.type === SchemeType.CENTRAL ? 'National' : scheme.state}
        </span>
        <div className="flex gap-1">
          {scheme.tags.slice(0, 2).map((tag, i) => (
             <span key={i} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-md">#{tag}</span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
        {scheme.title}
      </h3>
      
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {scheme.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
           {scheme.type === SchemeType.CENTRAL ? <Building2 size={14} /> : <MapPin size={14} />}
           <span>{scheme.type === SchemeType.CENTRAL ? 'Govt of India' : `Govt of ${scheme.state}`}</span>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ShieldCheck size={10} /> Verified
            </span>
            <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;