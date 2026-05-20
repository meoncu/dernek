import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, id, ...rest }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...rest}
        className={clsx(
          'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400',
          error
            ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ label, error, className, id, children, ...rest }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
          {label}
        </label>
      )}
      <select
        id={inputId}
        {...rest}
        className={clsx(
          'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-800 outline-none transition bg-white',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100',
          className
        )}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...rest }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-600">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...rest}
        className={clsx(
          'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 resize-none',
          error
            ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-slate-200 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
