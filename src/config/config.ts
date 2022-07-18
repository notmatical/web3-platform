import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export const USER_POOL_SIZE = 3664;
export const GLOBAL_AUTHORITY_SEED = 'global-authority';
export const EPOCH = 86400;
export const REWARD_TOKEN_DECIMAL = 1000000000;

export const REWARD_TOKEN_MINT = new PublicKey('326vsKSXsf1EsPU1eKstzHwHmHyxsbavY4nTJGEm3ugV');
export const PROGRAM_ID = '8g3PG15GWGFsBLtfaVXZ8ntpUTNvwDMsrW2dRFr7pR4V';

export const NFT_CREATOR = 'AV1xJmDHEBSigGA99A8SXqdcSMDR3gNywjCeFwTrtMni';
export const METAPLEX = new web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const artUA = process.env.REACT_APP_UA;
