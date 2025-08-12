import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ToastIdType = {
    id?: string;
    message: string;
    time: number;
    type: 'success' | 'warn' | 'error';
};
type ToastContextType = {
    toasts: ToastIdType[];
    addToast: (item: ToastIdType) => void;
    removeToast: (index: string) => void;
};

export const useToasts = () => {
    const context = useContext(ToastsContext);
    if (!context) {
        throw new Error('useToasts precisa do ToastsProvider');
    }
    return context;
};

const ToastsContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastIdType[]>([]);

    const addToast = (item: Omit<ToastIdType, 'id'>) => {
        const newToast = { ...item, id: crypto.randomUUID() };
        setToasts((prev) => [...prev!, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts((prevToasts) =>
            prevToasts.filter((toasts) => toasts.id !== id),
        );
    };

    return (
        <ToastsContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastsContext.Provider>
    );
};
