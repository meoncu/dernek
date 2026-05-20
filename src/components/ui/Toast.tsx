'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

const icons = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  error: <AlertCircle className="h-4 w-4 text-red-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
  warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
};

const bgClasses = {
  success: 'border-emerald-100 bg-white',
  error: 'border-red-100 bg-white',
  info: 'border-blue-100 bg-white',
  warning: 'border-amber-100 bg-white',
};

type Props = {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 flex flex-col gap-2 sm:bottom-4 sm:left-auto sm:right-4 sm:w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className={[
              'flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl',
              bgClasses[t.type],
            ].join(' ')}
          >
            <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
            <p className="flex-1 text-sm font-medium text-slate-700">{t.message}</p>
            <button
              onClick={() => onRemove(t.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600"
              aria-label="Kapat"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
