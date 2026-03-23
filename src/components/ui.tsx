import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({ label, suffix, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {label && <label className="text-[11px] font-bold text-blue-900 uppercase tracking-tight">{label}</label>}
      <div className="relative flex items-center">
        <input
          className={`w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 placeholder-slate-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400 transition-all ${suffix ? 'pr-10' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-2 text-[11px] font-bold text-blue-400">{suffix}</span>
        )}
      </div>
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {label && <label className="text-[11px] font-bold text-blue-900 uppercase tracking-tight">{label}</label>}
      <textarea
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 placeholder-slate-300 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400 min-h-[60px] resize-y transition-all"
        {...props}
      />
    </div>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  return (
    <label className={`flex items-center gap-1.5 cursor-pointer group ${className}`}>
      <input
        type="checkbox"
        className="h-3.5 w-3.5 rounded border-slate-300 bg-white text-blue-900 focus:ring-blue-500 focus:ring-offset-0 transition-all"
        {...props}
      />
      <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-900 transition-colors">{label}</span>
    </label>
  );
};

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', ...props }) => {
  return (
    <label className={`flex items-center gap-1.5 cursor-pointer group ${className}`}>
      <input
        type="radio"
        className="h-3.5 w-3.5 border-slate-300 bg-white text-blue-900 focus:ring-blue-500 focus:ring-offset-0 transition-all"
        {...props}
      />
      <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-900 transition-colors">{label}</span>
    </label>
  );
};

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <div className="mb-3 rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
      <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-1.5">
        {icon && <div className="text-blue-900">{icon}</div>}
        <h2 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.2em]">{title}</h2>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  label?: string;
  options: string[] | { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {label && <label className="text-[11px] font-bold text-blue-900 uppercase tracking-tight">{label}</label>}
      <select
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
        {...props}
      >
        {options.map((opt, idx) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value || idx} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
