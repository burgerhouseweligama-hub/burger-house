'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            min-w-[300px] p-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10
                            transform transition-all duration-300 animate-in slide-in-from-right-full
                            flex items-center gap-3
                            ${toast.type === 'success' ? 'bg-green-500/90 text-white' : ''}
                            ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
                            ${toast.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
                        `}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}

                        <p className="font-medium text-sm flex-1">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
