import { FC, ReactNode, useState, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import { useToasts } from 'hooks/useToasts';
import { useMeta } from 'contexts/meta/meta';
import { useAccess } from 'hooks/useAccess';
import { shortenAddress } from 'utils/utils';
import defaultConfig from 'config';
import { useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// reducer - state management
import { SET_AUTH_USER } from 'store/actions';
import accountReducer from 'store/accountReducer';

// web3 imports
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    GlowWalletAdapter,
    ExodusWalletAdapter,
    TorusWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// third party
import Cookies from 'js-cookie';
import { v4 as UIDV4 } from 'uuid';
import { NFT_CREATOR } from 'config/config';

export const WalletHandlerProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const { showInfoToast, showErrorToast } = useToasts();
    const { checkAccess } = useAccess();
    const { publicKey, signMessage } = useWallet();
    const [connected, setConnected] = useState(!!publicKey);

    // auth
    const [login] = useMutation(db.mutations.LOG_IN);
    // const [state, dispatch] = useReducer(accountReducer, testState);

    const hasNonce = () => !!Cookies.get('auth-nonce');

    const setNonce = async () => {
        const nonce = UIDV4();
        Cookies.set('auth-nonce', nonce, { expires: 1 });
        return nonce;
    };

    async function attemptLogin() {
        if (publicKey) {
            const gotNonce = hasNonce();
            if (gotNonce) {
                // user already has a nonce, no need to make them sign.

                const hasAccess = await checkAccess(publicKey, NFT_CREATOR);
                if (hasAccess) {
                    const address = publicKey.toBase58();
                    login({ variables: { address } }).then(
                        (res) => {
                            showInfoToast(`Connected to wallet ${shortenAddress(address)}`);
                            navigate(defaultConfig.defaultPath, { replace: true });
                        },
                        (err) => {
                            showErrorToast('Something unexpected happened, please try again later.');
                        }
                    );
                } else {
                    navigate('/purchase', { replace: true });
                }
                return;
            }

            // create a nonce, and sign message
            const nonce = await setNonce();
            try {
                const messageStr = `Welcome to the Yaku Labs Dashboard!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${publicKey}\n\nNonce:\n${nonce}`;
                const message = new TextEncoder().encode(messageStr);

                await signMessage!(message)
                    .then(async () => {
                        const hasAccess = await checkAccess(publicKey, NFT_CREATOR);
                        if (hasAccess) {
                            const address = publicKey.toBase58();
                            login({ variables: { address } }).then(
                                (res) => {
                                    showInfoToast(`Connected to wallet ${shortenAddress(address)}`);
                                    navigate(defaultConfig.defaultPath, { replace: true });
                                },
                                (err) => {
                                    console.log(err);
                                }
                            );
                        } else {
                            showErrorToast(`You don't hold any NFT's that have access to this platform.`);
                            navigate('/purchase', { replace: true });
                        }
                    })
                    .catch((err) => {
                        if (err.name === 'WalletSignTransactionError') {
                            Cookies.remove('auth-nonce');
                            showErrorToast('You must sign this message to access the platform.');
                            window.location.reload();
                        }
                    });
            } catch (error) {
                console.error(error);
            }
        }
    }

    // useEffect(() => {
    //     if (publicKey) {
    //         attemptLogin();
    //     }
    // }, [publicKey]);

    useEffect(() => {
        if (!publicKey && connected) {
            showInfoToast('Disconnected from wallet');
        }
        setConnected(!!publicKey);
    }, [publicKey, connected, setConnected]);

    return <>{children}</>;
};

export const WalletContext: FC<{ children: ReactNode }> = ({ children }) => {
    const network = WalletAdapterNetwork.Mainnet;
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const endpoint = 'https://ssc-dao.genesysgo.net/';

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new GlowWalletAdapter(),
            new ExodusWalletAdapter(),
            new TorusWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new SolletExtensionWalletAdapter({ network }),
            new SolletWalletAdapter({ network })
        ],
        [network]
    );

    const { showErrorToast } = useToasts();

    const onError = useCallback((error: WalletError) => {
        // custom handling for Slope since it doesn't return a message
        if (error.name === 'WalletAccountError') {
            showErrorToast(`The request was rejected, please try again.`);
        }
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint} config={{ confirmTransactionInitialTimeout: 240000 }}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect>
                <WalletHandlerProvider>{children}</WalletHandlerProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
