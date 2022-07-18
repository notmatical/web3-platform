import { PublicKey, AccountInfo } from '@solana/web3.js';

export type StringPublicKey = string;

const PubKeysInternedMap = new Map<string, PublicKey>();

export const toPublicKey = (key: string | PublicKey) => {
    if (typeof key !== 'string') {
        return key;
    }

    let result = PubKeysInternedMap.get(key);
    if (!result) {
        result = new PublicKey(key);
        PubKeysInternedMap.set(key, result);
    }

    return result;
};

export const pubKeyToString = (key: PublicKey | null | string = '') => (typeof key === 'string' ? key : key?.toBase58() || '');

export interface PublicKeyStringAndAccount<T> {
    pubkey: string;
    account: AccountInfo<T>;
}

export const RAFFLE_BURNER_ID = new PublicKey('HDnp9jhvLebGMCRqy88xXWQiydHNXjPJ8MwfNhoNqhjL');
