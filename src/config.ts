// web3
import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

// types
import { ThemeConfigProps, ConfigOptions } from 'types/config';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
export const BASE_PATH = '';
export const HS_API_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDb3NtaWMgQXN0cm9uYXV0cyIsIm5hbWUiOiJIeXBlcnNwYWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.TTK9PG6XPznw-jgbdGUMGuWs9i9arpLYRIUlvCXPdrc';

// staking/raffles
export const GLOBAL_AUTHORITY_SEED = 'global-authority';
export const METAPLEX = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const COSMIC_TOKEN_MINT = new PublicKey('326vsKSXsf1EsPU1eKstzHwHmHyxsbavY4nTJGEm3ugV');

export const USER_POOL_SIZE = 3664;
export const EPOCH = 86400;
export const STAKING_PROGRAM = '8g3PG15GWGFsBLtfaVXZ8ntpUTNvwDMsrW2dRFr7pR4V';

export const RAFFLE_SIZE = 66618;
// 66544
export const RAFFLE_PROGRAM = '7NQTWWABH9JYqWcFtukSEvuGNHX32sppwV4BBCgsQWJ9';
export const DECIMALS = 1000000000;
export const PREY_DECIMALS = 1000000000;

export const RAFFLE_ADMINS = [
    {
        address: '45rzLU1gPiEsaDtmkjvawgKDYYpSTHdVXKJjZ74dBDFg'
    }
];

export const appConfig: ConfigOptions = {
    spaces: {
        wallet: '45rzLU1gPiEsaDtmkjvawgKDYYpSTHdVXKJjZ74dBDFg',
        pricePerYear: 0.2
    },

    ambassadors: {
        defaultDiscount: 0.5,
        defaultPayout: 0.5
    }
};

export const config: ThemeConfigProps = {
    defaultPath: '/overview',
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    mode: 'dark', // light, dark
    presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
    locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
    container: false
};

export default config;
