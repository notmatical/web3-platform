import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const USER_POOL_SIZE = 3664;
export const GLOBAL_AUTHORITY_SEED = 'global-authority';
export const EPOCH = 86400;
export const REWARD_TOKEN_DECIMAL = 1000000000;

export const REWARD_TOKEN_MINT = new PublicKey('326vsKSXsf1EsPU1eKstzHwHmHyxsbavY4nTJGEm3ugV');
export const PROGRAM_ID = '8g3PG15GWGFsBLtfaVXZ8ntpUTNvwDMsrW2dRFr7pR4V';
export const STAKING_PROGRAM_ID = '37aAtYopXocCAbB3yQJ5382HGdo39P4ygKQtaRyhnVWG';
export const STAKING_CONFIG_ID = 'AyGU2zPhENQdLEkJQNTNaZbqAS5Hmh5ifAGZZXEGigcy';
export const STAKING_REWARD_MINT = 'NGK3iHqqQkyRZUj4uhJDQqEyKKcZ7mdawWpqwMffM3s';

export const TOKEN_ADDR = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const YAKU_SPL_TOKEN_PROGRAM_ID = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';

export const NFT_CREATOR = '5SjFvSud46uBFRNXQnAuzFspps5fRnhZjm83TXnY7BPu'; // astro only
export const YAKU_ONI_NFT_CREATOR = [
    'Dw73TsHMG8fgT7smeAobwcTZZeJ491NWAKQ1NSiRbJug',
    '6CzTQjSPcW9x4axzZLFtTq5BwsRvw4ksUWqaAkrEsRb9',
    'HMduKVo3A19U5EpQdEhPjo9hq9zfZXn8aGVYZp7Vc7fX'
];
export const YAKU_CAPSULE_NFT_CREATOR = [
    '2ekR5opinwLHa6GMr3LjJt44z4RA8Rx1hqviL6npFz5s',
    '6CzTQjSPcW9x4axzZLFtTq5BwsRvw4ksUWqaAkrEsRb9',
    'HMduKVo3A19U5EpQdEhPjo9hq9zfZXn8aGVYZp7Vc7fX'
];
export const YAKU_X_NFT_CREATOR = [
    '8vT6Uz3CuNXXW9qux432r6H4FufA76DJjMnMZb9EgVip',
    'EaFLjditD7WmUFEfnkcB778xTgpTemh5852Dwfi4fej9',
    'RRUMF9KYPcvNSmnicNMAFKx5wDYix3wjNa6bA7R6xqA'
];

export const YAKU_COLLECTION_CREATORS = [NFT_CREATOR, YAKU_ONI_NFT_CREATOR[0], YAKU_CAPSULE_NFT_CREATOR[0], YAKU_X_NFT_CREATOR[0]];
export const METAPLEX = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
export const TOKEN_ACC_SOLSCAN_API_ENDPOINT = 'https://public-api.solscan.io/account/tokens?account=';
export const TOKEN_ACCOUNT = 'C1zWiW8jA3rxKkMa5q8tADXpi8LXWciACQV3VG3KFgw';
export const YAKU_TOKEN_ACCOUNT = 'Ekmn56iJGTm5MXNf2PcF9fK2rj2qooWWKcxhStecudrX';

export const STAKING_OWNER_ADDR = '8dSqaJtFkoNfTDyWVS15MsSCLH1DXGmjJFvshEWkfDiG';

export const YAKU_STAKING_NODE = 'https://patient-dark-cherry.solana-mainnet.quiknode.pro/7b72f1d0ba0c9313a39cad3ae4f67c28f3b28755/';

export const YAKU_TOKEN_ICON =
    'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EK58dp4mxsKwwuySWQW826i3fwcvUK69jPph22VUcd2H/logo.png';

export const DEFAULT_PAY_TYPE = 'SOL';
export const TOKEN_PAY_TYPE = 'YAKU';

export const WHITELIST_MAX = 50;
export const TICKETS_MAX = 5000;
export const MAX_BUYING_TICKET = 0.1;
export const RAFFLE_REWARD_TYPES: Record<string, number> = {
    nft: 1,
    whitelist: 0,
    spl: 2
};

export const USE_QUIKNODE = true;

export const USDCMINT = 'FjmXVnxZCtzYZtJTJF69tzCoyQgwzGUAxuy1XLa7Wh1x';

export const DEBUG = 0;
export const SNIPER_API_ENDPOINT = 'https://api.halo-labs.io/';
export const SNIPER_API_URL = 'http://localhost:3333';
