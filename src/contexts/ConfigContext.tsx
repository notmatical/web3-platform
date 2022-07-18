import { createContext, ReactNode } from 'react';

// project import
import defaultConfig from 'config';
import useLocalStorage from 'hooks/useLocalStorage';

// types
import { PaletteMode } from '@mui/material';
import { CustomizationProps } from 'types/config';

// initial state
const initialState: CustomizationProps = {
    ...defaultConfig,
    onChangeMode: () => {},
    onChangePresetColor: () => {},
    onChangeLocale: () => {},
    onChangeContainer: () => {},
    onChangeFontFamily: () => {},
    onChangeBorderRadius: () => {}
};

// Config Context / Provider

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
    children: ReactNode;
};

function ConfigProvider({ children }: ConfigProviderProps) {
    const [config, setConfig] = useLocalStorage('minx-config', {
        fontFamily: initialState.fontFamily,
        borderRadius: initialState.borderRadius,
        container: initialState.container,
        mode: initialState.mode,
        presetColor: initialState.presetColor,
        locale: initialState.locale
    });

    const onChangeMode = (mode: PaletteMode) => {
        setConfig({
            ...config,
            mode
        });
    };

    const onChangePresetColor = (presetColor: string) => {
        setConfig({
            ...config,
            presetColor
        });
    };

    const onChangeLocale = (locale: string) => {
        setConfig({
            ...config,
            locale
        });
    };

    const onChangeContainer = () => {
        setConfig({
            ...config,
            container: !config.container
        });
    };

    const onChangeFontFamily = (fontFamily: string) => {
        setConfig({
            ...config,
            fontFamily
        });
    };

    const onChangeBorderRadius = (event: Event, newValue: number | number[]) => {
        setConfig({
            ...config,
            borderRadius: newValue as number
        });
    };

    return (
        <ConfigContext.Provider
            value={{
                ...config,
                onChangeMode,
                onChangePresetColor,
                onChangeLocale,
                onChangeContainer,
                onChangeFontFamily,
                onChangeBorderRadius
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
}

export { ConfigProvider, ConfigContext };
