import { toast } from 'react-toastify';

export const useToasts = () => {
    const showInfoToast = (message: string | any) => toast.info(message);
    const showErrorToast = (message: string | any) => toast.error(message);
    const showSuccessToast = (message: string | any) => toast.success(message);
    const showWarningToast = (message: string | any) => toast.warning(message);

    return {
        showInfoToast,
        showErrorToast,
        showSuccessToast,
        showWarningToast
    };
};

export default useToasts;
