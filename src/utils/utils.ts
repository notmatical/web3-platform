import { PublicKey } from '@solana/web3.js';
import { first, toUpper, get } from 'lodash';

/* eslint-disable */

// Cosmic Astronauts Related
export const casRoles = ['Adventurer', 'Scientist', 'Doctor', 'Mission Specialist', 'Commander'];
export const roleRewards = [
    { roles: ['Adventurer'], dailyReward: 20 },
    { roles: ['Scientist'], dailyReward: 25 },
    { roles: ['Doctor'], dailyReward: 30 },
    { roles: ['Mission Specialist'], dailyReward: 35 },
    { roles: ['Commander'], dailyReward: 40 }
];

export enum NftRole {
    CosmicRoles = 1,
    OneOfOne = 2
}

const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    {unit: "year", ms: 31536000000},
    {unit: "month", ms: 2628000000},
    {unit: "day", ms: 86400000},
    {unit: "hour", ms: 3600000},
    {unit: "minute", ms: 60000},
    {unit: "second", ms: 1000},
];

// Formatters
const rtf = new Intl.RelativeTimeFormat('en-US', {
    numeric: 'auto'
});

export const formatPriceNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const formatUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const formatPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

const numberFormater = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
});

export const formatPct = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
});

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

export function relativeTimeFromDates(relative: Date | null, pivot: Date = new Date()): string {
    if (!relative) return "";
    const elapsed = relative.getTime() - pivot.getTime();
    return relativeTimeFromElapsed(elapsed);
}

export function relativeTimeFromElapsed(elapsed: number): string {
    for (const {unit, ms} of units) {
        if (Math.abs(elapsed) >= ms || unit === "second") {
            return rtf.format(Math.round(elapsed / ms), unit);
        }
    }
    return "";
}

export const formatDate = {
    format: (val?: Date) => {
        if (!val) {
            return 'undefined';
        }

        return dateFormatter.format(val);
    }
};

export const formatNumber = {
    format: (val?: number) => {
        if (!val) {
            return '--';
        }

        return numberFormater.format(val);
    }
};

export const formatPercent = {
    format: (val?: number) => {
        if (!val) {
            return 'N/A';
        }

        return formatPct.format(val);
    }
};

// Functions
export function shortenAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export const STABLE_COINS = new Set(['USDC', 'wUSDC', 'USDT']);

export const tryParseKey = (key: string): PublicKey | null => {
    try {
        return new PublicKey(key);
    } catch (error) {
        return null;
    }
};

export const abbreviateValue = (value: number) => {
    let newValue: any = value;
    if (value >= 1000) {
        const suffixes = ['', 'K', 'M', 'B', 'T'];
        const suffixNum = Math.floor(('' + value).length / 3);
        let shortValue: any = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(precision));
            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
            if (dotLessShortValue.length <= 2) {
                break;
            }
        }
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
        newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
};

export const ordinal_suffix_of = (value: number | null) => {
    if (value === null || undefined) return 'Unranked';
    const j = value % 10, k = value % 100;

    if (j == 1 && k != 11) {
        return value + "st";
    }

    if (j == 2 && k != 12) {
        return value + "nd";
    }

    if (j == 3 && k != 13) {
        return value + "rd";
    }

    return value + "th";
};

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'] as const;
const abbreviateNumber = (number: number, precision: number) => {
    const tier = Math.log10(number) / 3 || 0;
    let scaled = number;
    const suffix = SI_SYMBOL[tier];

    if (tier !== 0) {
        const scale = Math.pow(10, tier * 3);
        scaled = number / scale;
    }

    precision = Number.isInteger(scaled) ? 0 : precision;

    return scaled.toFixed(precision) + suffix;
};

export const formatAmount = (val: number, precision: number = 2, abbr: boolean = true) =>
    abbr ? abbreviateNumber(val, precision) : val.toFixed(precision);

export function pub(pubkey: string) {
    return new PublicKey(pubkey);
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function royalty(value: number | undefined): string {
    return `${((value || 0) / 100).toFixed(2)}%`;
}

export function isValidHttpUrl(text: string) {
    if (text.startsWith('http:') || text.startsWith('https:')) {
        return true;
    }

    return false;
}

export function isValidSolanaAddress(address: string) {
    try {
        // eslint-disable-next-line
        new PublicKey(address);
        return true;
    } catch (error) {
        return false;
    }
}

export const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

export const stringAvatar = (name: string) => ({
    sx: {
        bgcolor: stringToColor(name)
    },
    children: toUpper(`${first(name.split(' ')[0])}${first(get(name.split(' '), 1, ' '))}`)
});