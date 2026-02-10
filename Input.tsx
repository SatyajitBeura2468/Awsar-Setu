import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-brand-500 focus:ring-0 outline-none transition-colors text-slate-900 placeholder:text-slate-400 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;