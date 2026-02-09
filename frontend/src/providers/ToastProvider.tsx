import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, type ToastProps } from '../components/ui/toast';
import type { ParsedError } from '../lib/errors';
import { getErrorAction } from '../lib/error-parser';

interface ToastContextType {
  showToast: (props: Omit<ToastProps, 'onClose'>) => void;
  showSuccess: (message: string) => void;
  showError: (message: string, error?: ParsedError) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastItem extends ToastProps {
  id: string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((props: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      ...props,
      id,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      },
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast({ message, type: 'success' });
  }, [showToast]);

  const showError = useCallback((message: string, error?: ParsedError) => {
    const suggestedAction = error ? getErrorAction(error) : undefined;
    showToast({
      message,
      type: 'error',
      category: error?.category,
      severity: error?.severity,
      action: suggestedAction,
      duration: 7000, // Errors stay longer
    });
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast({ message, type: 'warning', duration: 6000 });
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast({ message, type: 'info' });
  }, [showToast]);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showWarning, showInfo, clearToasts }}
    >
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
