import { alpha, Theme } from '@mui/material/styles';

const createCustomShadow = (theme: Theme, color: string) => {
    const transparent = alpha(color, 0.24);
    return {
        button: theme.palette.mode === 'dark' ? `0 2px 0 rgb(0 0 0 / 5%)` : `0 2px #0000000b`,

        z1:
            theme.palette.mode === 'dark'
                ? `0px 1px 1px rgb(0 0 0 / 14%), 0px 2px 1px rgb(0 0 0 / 12%), 0px 1px 3px rgb(0 0 0 / 20%)`
                : `0px 1px 4px ${alpha(theme.palette.grey[900], 0.08)}`,
        z8: `0 8px 16px 0 ${transparent}`,
        z12: `0 12px 24px 0 ${transparent} 0 10px 20px 0 ${transparent}`,
        z16: `0 0 3px 0 ${transparent} 0 14px 28px -5px ${transparent}`,
        z20: `0 0 3px 0 ${transparent} 0 18px 36px -5px ${transparent}`,
        z24: `0 0 6px 0 ${transparent} 0 21px 44px 0 ${transparent}`,

        primary: `0px 12px 14px 0px ${alpha(theme.palette.primary.main, 0.3)}`,
        secondary: `0px 12px 14px 0px ${alpha(theme.palette.secondary.main, 0.3)}`,
        orange: `0px 12px 14px 0px ${alpha(theme.palette.orange.main, 0.3)}`,
        success: `0px 12px 14px 0px ${alpha(theme.palette.success.main, 0.3)}`,
        warning: `0px 12px 14px 0px ${alpha(theme.palette.warning.main, 0.3)}`,
        error: `0px 12px 14px 0px ${alpha(theme.palette.error.main, 0.3)}`,

        primaryTest: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
        secondaryTest: `0 0 0 2px ${alpha(theme.palette.secondary.main, 0.2)}`,
        errorTest: `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}`,
        warningTest: `0 0 0 2px ${alpha(theme.palette.warning.main, 0.2)}`,
        infoTest: `0 0 0 2px ${alpha(theme.palette.info.main, 0.2)}`,
        successTest: `0 0 0 2px ${alpha(theme.palette.success.main, 0.2)}`,
        grey: `0 0 0 2px ${alpha(theme.palette.grey[500], 0.2)}`
    };
};

export default function customShadows(mode: string, theme: Theme) {
    return mode === 'dark' ? createCustomShadow(theme, theme.palette.dark.main) : createCustomShadow(theme, theme.palette.grey[600]);
}
