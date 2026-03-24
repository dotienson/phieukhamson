import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({ label, suffix, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
      <div className="relative flex items-center">
        <input
          className={`w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-3.5 py-2.5 text-base text-slate-700 placeholder-slate-400 shadow-sm focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100/50 disabled:bg-slate-100 disabled:text-slate-400 transition-all ${suffix ? 'pr-12' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-4 text-sm font-medium text-slate-400">{suffix}</span>
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
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
      <textarea
        className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-3.5 py-2.5 text-base text-slate-700 placeholder-slate-400 shadow-sm focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100/50 disabled:bg-slate-100 disabled:text-slate-400 min-h-[80px] resize-y transition-all"
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
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <input
        type="checkbox"
        className="h-5 w-5 rounded-md border-2 border-slate-200 bg-white text-pink-500 focus:ring-pink-400 focus:ring-offset-0 transition-all"
        {...props}
      />
      <span className="text-base font-medium text-slate-600 group-hover:text-pink-600 transition-colors">{label}</span>
    </label>
  );
};

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Radio: React.FC<RadioProps> = ({ label, className = '', ...props }) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <input
        type="radio"
        className="h-5 w-5 border-2 border-slate-200 bg-white text-pink-500 focus:ring-pink-400 focus:ring-offset-0 transition-all"
        {...props}
      />
      <span className="text-base font-medium text-slate-600 group-hover:text-pink-600 transition-colors">{label}</span>
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
    <div className="mb-6 rounded-[2rem] bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-white">
      <div className="mb-6 flex items-center gap-3">
        {icon && <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600 shadow-inner">{icon}</div>}
        <h2 className="text-lg font-bold text-slate-700 tracking-wide">{title}</h2>
      </div>
      <div className="space-y-5">
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
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
      <select
        className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-3.5 py-2.5 text-base text-slate-700 shadow-sm focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100/50 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
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
