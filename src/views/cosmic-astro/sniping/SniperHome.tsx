/* eslint-disable no-await-in-loop */
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import { useRecoilState } from 'recoil';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';
import { snipedIdentifierAtom } from './recoil/atom/HaloLabsAtom';
import Sniper from 'components/HaloBullsTool/SniperPage/Sniper';
import { SNIPER_API_URL } from 'config/config';
import { cloneDeep } from 'lodash';

const SniperHome = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    const { showInfoToast, showErrorToast } = useToasts();
    const [snipedIdentifier, setSnipedIdentifier] = useRecoilState(snipedIdentifierAtom);

    const delay = (ms?: number) => new Promise((res) => setTimeout(res, ms));
    const getBuyInstructions = async (MEData: any, walletAddress: string) => {
        let tries = 0;
        const url = `${
            process.env.NODE_ENV === 'development' ? SNIPER_API_URL : ''
        }/getMETransactionInstructionsForSnipe?buyer=${walletAddress}&tokenMint=${MEData.tokenMint}&price=${MEData.price}&expiry=${
            MEData.expiry
        }&pdaAddress=${MEData.pdaAddress}&auctionHouse=${MEData.auctionHouse}&tokenAddress=${MEData.tokenAddress}&seller=${
            MEData.seller
        }&sellerReferral=${MEData.sellerReferral}`;

        let result: any = {};
        try {
            const { data } = await axios.get(url);
            result = data;
        } catch (error) {
            console.error(error);
        }
        while (Object.keys(result).length === 0 && tries <= 30) {
            if (tries === 0) {
                await delay(500);
            } else {
                await delay(300 + 35 * tries);
            }
            // ('retrying buy instruction ' + String(tries));
            try {
                const { data } = await axios.get(url);
                result = data;
            } catch (error) {
                console.error(error);
            }
            tries += 1;
        }

        return result;
    };
    const buyNow = async (MEData: any, identifier: never) => {
        if (wallet.publicKey && !snipedIdentifier.includes(identifier)) {
            showInfoToast('Sniping...');
            // goes through each NFT in cart, gets the ME transaction detail,
            // and makes a transaction object from it
            try {
                const response = await getBuyInstructions(MEData, wallet.publicKey.toBase58());
                if (Object.keys(response).length > 0) {
                    // console.log('got proper response');
                    const transaction = Transaction.from(Buffer.from(response.txSigned));
                    let signature = null;
                    const res = await wallet.sendTransaction(transaction, connection, { maxRetries: 2 });
                    const latestBlockHash = await connection.getLatestBlockhash();
                    // await connection.confirmTransaction({
                    //     blockhash: latestBlockHash.blockhash,
                    //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    //     signature: res
                    // });
                    let tries = 0;
                    while (tries < 100 && signature === null) {
                        tries += 1;
                        // console.log('Got null. In while loop. Tries: ', tries);
                        await delay(100);
                        try {
                            const getTransResp = await connection.getTransaction(res, { commitment: 'confirmed' });
                            if (getTransResp === null) {
                                // console.log('got null getTransaction');
                                signature = null;
                                // eslint-disable-next-line no-continue
                                continue;
                            }
                            if (typeof getTransResp === 'object' && getTransResp?.meta?.err === null) {
                                // showInfoToast(
                                //     <a href={`https://solscan.io/tx/${res}`} target="_blank" rel="noreferrer" className="m-auto">
                                //         Sniped, Congrats!
                                //     </a>
                                // );
                                signature = res;
                                // eslint-disable-next-line no-continue
                                continue;
                            }
                            showErrorToast('Unsuccessful!');
                            signature = -1;
                        } catch (error) {
                            showErrorToast('Unsuccessful!');
                            signature = -1;
                        }
                    }
                    if (signature !== -1) {
                        setSnipedIdentifier([identifier].concat(cloneDeep(snipedIdentifier)));
                    }
                    return signature;
                }
            } catch (error) {
                console.error(error);
            }
            return -1;
        }
        return -1;
    };
    return (
        <Grid
            container
            sx={{
                marginTop: 0,
                marginLeft: 0,
                width: '100%'
            }}
            spacing={gridSpacing}
        >
            <Sniper buyNow={buyNow} />
        </Grid>
    );
};

export default SniperHome;
