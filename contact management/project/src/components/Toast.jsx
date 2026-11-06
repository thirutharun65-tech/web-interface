import { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-brand-500" />,
  };
  return (
    <div className="flex items-center gap-3 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl shadow-float px-4 py-3 animate-toastIn min-w-[280px]">
      {icons[toast.type] || icons.success}
      <span className="text-sm font-medium text-ink-900 dark:text-ink-50 flex-1">
        {toast.message}
      </span>
    </div>
  );
}
