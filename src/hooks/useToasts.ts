import { toast } from 'react-toastify';

export const useToasts = () => {
    const showInfoToast = (message: string, close: boolean = false) => toast.info(message);
    const showErrorToast = (message: string, close: boolean = false) => toast.error(message);
    const showSuccessToast = (message: string, close: boolean = false) => toast.success(message);
    const showWarningToast = (message: string, close: boolean = false) => toast.warning(message);

    return {
        showInfoToast,
        showErrorToast,
        showSuccessToast,
        showWarningToast
    };
};

export default useToasts;
