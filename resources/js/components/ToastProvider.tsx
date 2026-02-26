import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { usePage } from '@inertiajs/react';
import { processFlashMessages } from '@/utils/toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const { flash } = usePage().props as any;

  useEffect(() => {
    // Procesar mensajes flash cuando cambian
    if (flash) {
      processFlashMessages(flash);
    }
  }, [flash]);

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
