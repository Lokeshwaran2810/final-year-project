import React from 'react';
import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info
};

const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200"
};

const Toaster = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => {
                const Icon = icons[toast.type] || icons.info;
                return (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto flex items-start gap-3 min-w-[300px] p-4 rounded-lg shadow-lg border animate-in slide-in-from-right fade-in duration-300",
                            styles[toast.type] || styles.info
                        )}
                    >
                        <Icon size={20} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default Toaster;
