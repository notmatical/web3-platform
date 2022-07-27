import { toast } from 'react-toastify';

export const useToasts = () => {
    const showInfoToast = (message: string) => toast.info(message);
    const showErrorToast = (message: string) => toast.error(message);
    const showSuccessToast = (message: string) => toast.success(message);
    const showWarningToast = (message: string) => toast.warning(message);

    return {
        showInfoToast,
        showErrorToast,
        showSuccessToast,
        showWarningToast
    };
};

export default useToasts;
