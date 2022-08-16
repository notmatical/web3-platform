import { Commitment, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { NftRole, casRoles } from 'utils/utils';

enum VerifiedTokens {
    SOL = 'So11111111111111111111111111111111111111112',
    SRM = 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    RAY = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    FIDA = 'EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp',
    MNGO = 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
    ORCA = 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
    COSMIC = '326vsKSXsf1EsPU1eKstzHwHmHyxsbavY4nTJGEm3ugV',
    VAPOR = 'BdwbTU3G23sub6wcGX1WJCM2dG8GJu8faip5QQ8BmvNc',
    AURY = 'AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP',
    FOXY = 'FoXyMu5xwXre7zEoSvzViRk3nGawHUp9kUh97y2NDhcq',
    PUFF = 'G9tt98aYSznRk7jWsfuz9FnTdokxS6Brohdo9hSmjTRB',
    DUST = 'DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ',
    FORGE = 'FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds',
    STEP = 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT'
}

export default VerifiedTokens;
