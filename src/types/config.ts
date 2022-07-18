import { PaletteMode } from '@mui/material';

export type ConfigOptions = {
    spaces: {
        wallet: string,
        pricePerYear: number
    }

    ambassadors: {
        defaultDiscount: number,
        defaultPayout: number
    }
};

export type ThemeConfigProps = {
    defaultPath: string;
    fontFamily: string;
    borderRadius: number;
    mode: PaletteMode;
    presetColor: string;
    locale: string;
    container: boolean;
};

export type CustomizationProps = {
    fontFamily: string;
    borderRadius: number;
    mode: PaletteMode;
    presetColor: string;
    locale: string;
    container: boolean;
    onChangeMode: (mode: PaletteMode) => void;
    onChangePresetColor: (presetColor: string) => void;
    onChangeLocale: (locale: string) => void;
    onChangeContainer: () => void;
    onChangeFontFamily: (fontFamily: string) => void;
    onChangeBorderRadius: (event: Event, newValue: number | number[]) => void;
};
