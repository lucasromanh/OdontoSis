import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(id), 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const styles = {
        success: 'bg-emerald-50 border-emerald-100 text-emerald-800',
        error: 'bg-red-50 border-red-100 text-red-800',
        info: 'bg-blue-50 border-blue-100 text-blue-800',
        loading: 'bg-slate-50 border-slate-100 text-slate-800'
    };

    const icons = {
        success: <CheckCircle2 size={18} className="text-emerald-500" />,
        error: <AlertCircle size={18} className="text-red-500" />,
        info: <Info size={18} className="text-blue-500" />,
        loading: <div className="w-4 h-4 border-2 border-[#137fec] border-t-transparent rounded-full animate-spin" />
    };

    return (
        <div className={`
            flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-xl shadow-black/5 
            animate-in slide-in-from-right-full duration-300 pointer-events-auto
            ${styles[type]}
        `}>
            {icons[type]}
            <p className="text-[11px] font-black uppercase tracking-widest italic">{message}</p>
            <button onClick={() => onClose(id)} className="p-1 hover:bg-black/5 rounded-lg transition-colors ml-4">
                <X size={14} className="opacity-40" />
            </button>
        </div>
    );
};

export const ToastContainer: React.FC<{ toasts: any[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
            {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onClose={removeToast} />
            ))}
        </div>
    );
};
