/* eslint-disable */

import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';


import { getUserPoolState } from 'actions/stake';
import { NFT_CREATOR } from 'config/config';

export const useAccess = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const checkCosmicAccess = async (publicKey: PublicKey) => {
        if (publicKey) {
            if (publicKey.toBase58() === '45rzLU1gPiEsaDtmkjvawgKDYYpSTHdVXKJjZ74dBDFg') {
                return true;
            }

            const userPoolData = await getUserPoolState(wallet);
            const numStaked = userPoolData?.itemCount.toNumber();

            const nftsList = await getParsedNftAccountsByOwner({ publicAddress: publicKey.toBase58(), connection });
            for (const item of nftsList) {
                if (item.data.creators === undefined) continue;
                if (numStaked !== 0 && numStaked !== null && numStaked !== undefined) return true;
                if (item.data.creators[0].address === NFT_CREATOR && item.data.creators[0].verified == true) {
                    return true;
                }
            }

            return false;
        }
        return false;
    };

    const checkAccess = async (publicKey: PublicKey, accessKey: string) => {
        if (publicKey) {
            if (publicKey.toBase58() === '45rzLU1gPiEsaDtmkjvawgKDYYpSTHdVXKJjZ74dBDFg') {
                return true;
            }

            const nftsList = await getParsedNftAccountsByOwner({ publicAddress: publicKey.toBase58(), connection });
            for (const item of nftsList) {
                if (item.data.creators === undefined) continue;
                // eslint-disable-next-line
                if (item.data.creators[0].address === accessKey && item.data.creators[0].verified == true) {
                    return true;
                }
            }

            return false;
        }
        return false;
    };

    return { checkAccess, checkCosmicAccess };
};

export default useAccess;
