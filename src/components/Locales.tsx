import React, { useState, useEffect } from 'react';

// third-party
import { IntlProvider, MessageFormatElement } from 'react-intl';
import useConfig from 'hooks/useConfig';
import { find } from 'lodash';
import { LOCALES } from 'config';

// load locales files
const loadLocaleData = (locale: string) => {
    if (!find(LOCALES, ({ value }) => value === locale)) {
        return import('utils/locales/en.json');
    }
    return import(`utils/locales/${locale}.json`);
};

// ==============================|| LOCALIZATION ||============================== //

interface LocalsProps {
    children: React.ReactNode;
}

const Locales = ({ children }: LocalsProps) => {
    const { locale } = useConfig();
    const [messages, setMessages] = useState<Record<string, string> | Record<string, MessageFormatElement[]> | undefined>();

    useEffect(() => {
        loadLocaleData(locale).then((d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
            setMessages(d.default);
        });
    }, [locale]);

    return (
        <>
            {messages && (
                <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
                    {children}
                </IntlProvider>
            )}
        </>
    );
};

export default Locales;
