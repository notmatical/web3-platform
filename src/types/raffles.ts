import { MetadataKey } from '@nfteyez/sol-rayz/dist/config/metaplex';
import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { KeyedObject } from 'types';

export interface GlobalPool {
    superAdmin: PublicKey;
}

export interface RafflePool {
    creator: PublicKey;
    nftMint: PublicKey;
    count: anchor.BN;
    winnerCount: anchor.BN;
    noRepeat: anchor.BN;
    maxEntrants: anchor.BN;
    endTimestamp: anchor.BN;
    ticketPricePrey: anchor.BN;
    ticketPriceSol: anchor.BN;
    whitelisted: anchor.BN;
    indexes: anchor.BN[];
    claimedWinner: anchor.BN[];
    winner: PublicKey[];
    entrants: PublicKey[];
    raffleKey: string;
}
export interface NFTDetail {
    image: string;
    name: string;
    description: string;
    family: string;
    raffleData: NFTRaffleData;
}

export interface NFTRaffleData {
    creator: string;
    tickets: number;
    end: number;
    wl: number;
    price: number;
    payType: string;
    myTickets: Array<{ index: number }>;
    maxTickets: number;
    winnerCnt: number;
    winners: Array<{
        address: any;
        index: number;
        claimed: number;
    }>;
    isRevealed: boolean;
    isClaimed: boolean;
    isWinner: boolean;
    allClaimed: boolean;
    featured: boolean;
}

export interface NFTType {
    mint: string;
    updateAuthority: string;
    data: {
        creators: any[];
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
    };
    key: MetadataKey;
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number;
    masterEdition?: string;
    edition?: string;
}

export interface RaffleEntry {
    ticketPriceToken: number;
    ticketPriceSol: number;
    endTimestamp: number;
    nftMint: string;
    raffleKey: string;
    ticketsCount: number;
    maxEntrants: number;
    image?: string;
    name?: string;
    description?: string;
    family?: string;
    featured?: boolean;
    rewardType?: number;
}

export interface RewardCardProps extends KeyedObject {
    ticketPriceToken: number;
    ticketPriceSol: number;
    endTimestamp: number;
    ticketsCount: number;
    nftMint: string;
    raffleKey: string;
    maxEntrants: number;
    image?: string;
    name?: string;
    description?: string;
    family?: string;
    rewardType?: number;
    isAdmin: boolean;
}