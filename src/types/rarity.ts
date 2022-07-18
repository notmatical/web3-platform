import { KeyedObject } from 'types';

// nft rarity search
export type NFTs = {
    id: string | number | undefined;
    image: string;
    name: string;
    rank?: number;
    role?: string;
    description?: string;
    categories?: string[];
    date?: number;
    created: Date;
    new?: number;
};

// rarity search filter
export type NftsFilter = {
    length?: number;
    search: string;
    sort: string;
    categories: string[];
};

// sort options
export type RaritySortOptionsProps = {
    value: string;
    label: string;
};

export interface RarityStateProps {
    nfts: NFTs[];
    nft: NFTs | null;
    relatedNfts: NFTs[];
    error: object | string | null;
}

export interface NftCardProps extends KeyedObject {
    id?: string | number;
    color?: string;
    name: string;
    image: string;
    description?: string;
    offerPrice?: number;
    salePrice?: number;
    rating?: number;
}
