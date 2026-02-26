import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ToastOptions {
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: undefined | number;
  theme?: 'light' | 'dark' | 'colored';
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
    ...options
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
    ...options
  });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
    ...options
  });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
    ...options
  });
};

// Helper para procesar mensajes flash de Inertia
export const processFlashMessages = (flash: any) => {
  if (flash.success) {
    showSuccessToast(flash.success);
  }
  if (flash.error) {
    showErrorToast(flash.error);
  }
  if (flash.warning) {
    showWarningToast(flash.warning);
  }
  if (flash.info) {
    showInfoToast(flash.info);
  }
};
