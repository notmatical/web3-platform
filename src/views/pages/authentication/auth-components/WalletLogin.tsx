import { useMemo, useCallback, useState, useEffect, SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Box,
    Divider,
    Button,
    Grid,
    Stack,
    Typography,
    useMediaQuery,
    CircularProgress,
    TextField,
    Alert,
    Chip,
    Avatar,
    Switch
} from '@mui/material';

// web3 imports
import { WalletAdapter, WalletReadyState } from '@solana/wallet-adapter-base';
import { useConnection, useWallet, Wallet } from '@solana/wallet-adapter-react';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthFooter from 'components/cards/AuthFooter';
import useConfig from 'hooks/useConfig';
import defaultConfig from 'config';
import { useAccess } from 'hooks/useAccess';
import { useToasts } from 'hooks/useToasts';
import { shortenAddress } from 'utils/utils';
import { getUserPoolState } from 'actions/stake';
import { NFT_CREATOR } from 'config/config'; // TODO: Replace with database query for access keys + packages

// third party
import { useMutation } from '@apollo/client';
import * as db from 'database/graphql/graphql';
import { isMobile } from 'react-device-detect';

// assets
import logoDark from 'assets/images/vapor-logo-light.png';
import logo from 'assets/images/vapor-logo-dark.png';
import MetaMaskLogo from 'assets/images/icons/metamask.png';
import Confetti from 'assets/images/icons/confetti.png';
import DiscordLogo from 'assets/images/icons/discord.svg';
import { SystemProgram, Transaction } from '@solana/web3.js';
import { explorerLinkFor } from 'utils/transactions';

const WalletButton = styled(Button)({
    gap: '5px'
});

/*

    If you do it in one file, seperate components in this file and bridge states with cross comp.
    TODO:
    STEP SYSTEM: Step 1 (Connect Wallet / Sign Message) -> 2 (Choose Username) -> 3 (Give option to link Discord)
    Access & Refresh tokens, Jwt

*/
enum STEPS {
    SELECT_WALLET = 0,
    SIGN_MESSAGE = 1,
    CHOOSE_USERNAME = 2,
    LINK_DISCORD = 3
}

const WalletLogin = () => {
    const [step, setStep] = useState(STEPS.SELECT_WALLET);
    const [username, setUsername] = useState('');
    const [isLedger, setIsLedger] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);

    // wallet init
    const { wallets, connected, connecting, publicKey, select, connect, disconnect, signMessage } = useWallet();
    const wallet = useWallet();
    const { connection } = useConnection();

    // hooks
    const theme = useTheme();
    const navigate = useNavigate();
    const { checkAccess } = useAccess();
    const { showInfoToast, showErrorToast, showWarningToast } = useToasts();
    const { borderRadius } = useConfig();

    // mutations / queries
    const [login] = useMutation(db.mutations.LOG_IN);
    const [signup] = useMutation(db.mutations.SIGN_UP);

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [listWallets] = useMemo(() => {
        const detected: Wallet[] = [];

        // eslint-disable-next-line @typescript-eslint/no-shadow
        for (const wallet of wallets) {
            if (isMobile) {
                const name = wallet?.adapter?.name;
                if (name === 'Solflare' || name === 'Slope' || name === 'Phantom') {
                    detected.push(wallet);
                }
            } else if (wallet.readyState === WalletReadyState.Installed) {
                detected.push(wallet);
            }
        }

        setTimeout(() => {
            setIsConnecting(false);
        }, 1500);

        return [detected];
    }, [wallets]);

    useEffect(() => {
        if (publicKey && connected) {
            setStep(STEPS.SIGN_MESSAGE);
        }

        console.log(`connecting: ${connecting} | connected: ${connected}`);
        if (!connecting && !connected) {
            connect().catch(() => {});
        }
    }, [publicKey, connect]);

    const handleEtherLogin = () => {
        showErrorToast('Ethereum authentication is not been enabled yet.');
    };

    // new functions
    const handleClick = useCallback(
        (adapter: WalletAdapter) => {
            console.log(adapter);
            if (adapter.name !== wallet.wallet?.adapter.name) {
                console.log('selecting', adapter.name);
                select(adapter.name);
            }
        },
        [select]
    );

    const attemptLogin = async (address: string) => {
        if (publicKey) {
            if (address) {
                const userPoolData = await getUserPoolState(wallet);
                const numStaked = userPoolData?.itemCount.toNumber();

                const hasAccess = await checkAccess(publicKey!, NFT_CREATOR);
                if (hasAccess) {
                    login({ variables: { wallet: address } }).then(
                        (res) => {
                            if (res.data.login.registered) {
                                setIsConnecting(false);
                                showInfoToast(`Connected to wallet ${shortenAddress(address)}`);
                                navigate(defaultConfig.defaultPath, { replace: true });
                                return;
                            }
                            setStep(STEPS.CHOOSE_USERNAME);
                            setIsConnecting(false);
                        },
                        (err) => {
                            showErrorToast('An error occurred while contacting the database, please try again.');
                            setIsConnecting(false);
                        }
                    );
                } else {
                    login({ variables: { wallet: address } }).then(
                        (res) => {
                            if (numStaked !== 0 && numStaked !== null && numStaked !== undefined) {
                                setIsConnecting(false);
                                showInfoToast(`Connected to wallet ${shortenAddress(address)}`);
                                navigate(defaultConfig.defaultPath, { replace: true });
                                return;
                            }
                            showErrorToast(`You don't hold any NFT's that have access to this platform.`);
                            navigate('/purchase', { replace: true });
                        },
                        (err) => {
                            showErrorToast('An error occurred while contacting the database, please try again.');
                            setIsConnecting(false);
                        }
                    );
                }
            } else {
                setStep(STEPS.SELECT_WALLET);
                setIsConnecting(false);
                showErrorToast('There seems to be an issue with your connection, please try again.');
            }
        }
    };

    const handleSignTransaction = async () => {
        if (publicKey) {
            setIsConnecting(true);
            try {
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: publicKey,
                        lamports: 1000
                    })
                );

                transaction.feePayer = publicKey;
                const blockHashObj = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockHashObj.blockhash;

                const signature = await wallet.sendTransaction(transaction, connection);
                await connection.confirmTransaction(signature, 'confirmed');

                attemptLogin(publicKey.toBase58());

                setIsConnecting(false);

                console.log(explorerLinkFor(signature, connection));
            } catch (err) {
                setStep(STEPS.SIGN_MESSAGE);
                setIsConnecting(false);
                showErrorToast(`The request was rejected, please try again.`);
                console.log(err);
            }
        }
    };

    const handleSignMessage = async () => {
        if (publicKey) {
            setIsConnecting(true);
            try {
                const message = `Welcome to Vaporize Finance!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nYour authentication status will reset after 24 hours.\n\nWallet address:\n${publicKey}`;
                const encodedMessage = new TextEncoder().encode(message);
                const signature = await signMessage!(encodedMessage);
                if (!signature) showErrorToast(`An error occurred while confirming the signature, please try again.`);

                attemptLogin(publicKey.toBase58());
            } catch (err: any) {
                console.log(err);
                setStep(STEPS.SIGN_MESSAGE);
                setIsConnecting(false);
                showErrorToast(`The request was rejected, please try again.`);
            }
        } else {
            setStep(STEPS.SELECT_WALLET);
        }
    };

    const link = async (type: string) => {
        // OAuth init
        showWarningToast('Discord integration is going to be added at a later date.');
    };

    const handleUsername = async (name: string) => {
        setUsername(name);

        // check username for dupes
    };

    const handleSignup = async () => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const wallet = publicKey?.toBase58();
        if (wallet !== null) {
            signup({ variables: { wallet, vanity: username } }).then(
                (res) => {
                    console.log(res);
                    setStep(STEPS.LINK_DISCORD);
                    showInfoToast('Congratulations! You are all set and ready to dive into the Vaporverse');
                },
                (err) => {
                    console.log(err);
                }
            );
        } else {
            setStep(STEPS.SELECT_WALLET);
            showErrorToast('There seems to be an issue with your connection, please try again.');
        }

        // setStep(STEPS.LINK_DISCORD);
    };

    const handleProfileVisit = async () => {
        if (!publicKey || !connected) {
            setStep(STEPS.SELECT_WALLET);
            showErrorToast('There seems to be an issue with your connection, please try again.');
            return;
        }
        // navigate(`/account/${publicKey?.toBase58()}/portfolio`, { replace: true });
        navigate(defaultConfig.defaultPath, { replace: true });
    };

    // TODO: PublicKey and wallet is not being reset, so clicking another button doesnt work.
    const handleReset = async () => {
        await wallet.disconnect().then(() => console.log('disconnect'));
        setIsLedger(false);
        setStep(STEPS.SELECT_WALLET);
    };

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const handleBack = async (step: number) => {
        if (step === 1) {
            handleReset();
            return;
        }
        setStep(step - 1);
    };

    return (
        <AuthWrapper>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    {step === 3 ? (
                                        <Grid item>
                                            <Link to="#">
                                                <img src={Confetti} alt="Complete" width={120} height={120} />
                                            </Link>
                                        </Grid>
                                    ) : (
                                        <Grid item>
                                            <Link to="#">
                                                <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Vaporize" width="200" />
                                            </Link>
                                        </Grid>
                                    )}
                                    {connecting || isConnecting ? (
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                direction={matchDownSM ? 'column-reverse' : 'row'}
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{ mt: 1 }}
                                            >
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                        <CircularProgress color="secondary" />
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <>
                                            {step === 0 && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Grid
                                                            container
                                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Grid item>
                                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                                        Please connect your wallet which has access to the Vaporize
                                                                        Dashboard
                                                                    </Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <Grid item xs={12}>
                                                            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                                                                <Button
                                                                    variant="outlined"
                                                                    sx={{
                                                                        cursor: 'unset',
                                                                        m: 2,
                                                                        py: 0.5,
                                                                        px: 7,
                                                                        borderColor:
                                                                            theme.palette.mode === 'dark'
                                                                                ? `${theme.palette.dark.light + 20} !important`
                                                                                : `${theme.palette.grey[100]} !important`,
                                                                        color: `${theme.palette.grey[900]}!important`,
                                                                        fontWeight: 500,
                                                                        borderRadius: `${borderRadius}px`
                                                                    }}
                                                                    disableRipple
                                                                    disabled
                                                                >
                                                                    SOLANA
                                                                </Button>

                                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                                            </Box>
                                                        </Grid>

                                                        {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
                                                        {listWallets.map((wallet, index) => (
                                                            <WalletButton
                                                                key={index}
                                                                sx={{ mb: 1 }}
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={() => handleClick(wallet.adapter)}
                                                                fullWidth
                                                            >
                                                                <img src={wallet.adapter.icon} alt="Wallet Image" width={24} height={24} />
                                                                {wallet.adapter.name}
                                                            </WalletButton>
                                                        ))}

                                                        {/* ETH WALLETS */}
                                                        <Grid item xs={12}>
                                                            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                                                                <Button
                                                                    variant="outlined"
                                                                    sx={{
                                                                        cursor: 'unset',
                                                                        m: 2,
                                                                        py: 0.5,
                                                                        px: 7,
                                                                        borderColor:
                                                                            theme.palette.mode === 'dark'
                                                                                ? `${theme.palette.dark.light + 20} !important`
                                                                                : `${theme.palette.grey[100]} !important`,
                                                                        color: `${theme.palette.grey[900]}!important`,
                                                                        fontWeight: 500,
                                                                        borderRadius: `${borderRadius}px`
                                                                    }}
                                                                    disableRipple
                                                                    disabled
                                                                >
                                                                    ETHEREUM
                                                                </Button>

                                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                                            </Box>
                                                        </Grid>

                                                        <WalletButton
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => handleEtherLogin()}
                                                            fullWidth
                                                        >
                                                            <img src={MetaMaskLogo} alt="MetaMask" width={24} height={24} />
                                                            MetaMask
                                                        </WalletButton>
                                                    </Grid>
                                                </>
                                            )}

                                            {step === 1 && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Grid
                                                            container
                                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Grid item>
                                                                <Stack alignItems="center" justifyContent="center" spacing={3}>
                                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                                        You are required to prove ownership of this wallet by signing this
                                                                        message.
                                                                    </Typography>

                                                                    <Chip
                                                                        label={publicKey && shortenAddress(publicKey.toBase58(), 5)}
                                                                        size="medium"
                                                                        variant="filled"
                                                                    />

                                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                                        Using Ledger?
                                                                    </Typography>
                                                                    <Switch
                                                                        sx={{ mt: '0px !important' }}
                                                                        color="secondary"
                                                                        checked={isLedger}
                                                                        onChange={(e) => setIsLedger(e.target.checked)}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                                        <Stack direction="column" justifyContent="center">
                                                            <WalletButton
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={isLedger ? handleSignTransaction : handleSignMessage}
                                                            >
                                                                {!isLedger ? 'Sign Message' : 'Sign Transaction'}
                                                            </WalletButton>

                                                            <WalletButton
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => handleBack(step)}
                                                                sx={{ mt: 2 }}
                                                            >
                                                                Go Back
                                                            </WalletButton>
                                                        </Stack>
                                                    </Grid>
                                                </>
                                            )}

                                            {step === 2 && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Grid
                                                            container
                                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Grid item>
                                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                                        It appears to be your first time accessing the Vaporize Dashboard.
                                                                        <br />
                                                                        <br />
                                                                        You are eligible to choose a username, this will be displayed around
                                                                        the site and used as your vanity url.
                                                                    </Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                                        <TextField
                                                            fullWidth
                                                            label="Username (Optional)"
                                                            value={username}
                                                            onChange={(e) => handleUsername(e.target.value)}
                                                        />

                                                        {/* {username && (
                                                            <Alert severity="warning" sx={{ mt: 2 }}>
                                                                This username is already taken.
                                                            </Alert>
                                                        )} */}

                                                        <Stack direction="row" justifyContent="space-between">
                                                            <WalletButton
                                                                variant="outlined"
                                                                color="primary"
                                                                onClick={() => handleBack(step)}
                                                                sx={{ mt: 2 }}
                                                            >
                                                                Go Back
                                                            </WalletButton>

                                                            <WalletButton
                                                                variant="contained"
                                                                color="secondary"
                                                                onClick={handleSignup}
                                                                sx={{ mt: 2 }}
                                                            >
                                                                Sign Up
                                                            </WalletButton>
                                                        </Stack>
                                                    </Grid>
                                                </>
                                            )}

                                            {step === 3 && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <Grid
                                                            container
                                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Grid item>
                                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                                    {/* <img src={Confetti} alt="Complete" width={120} height={120} /> */}
                                                                    <Typography variant="h1" fontSize="16px" textAlign="center">
                                                                        Congratulations!
                                                                    </Typography>

                                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                                        Your account has been successfully created.
                                                                        <br />
                                                                        <br />
                                                                        You can choose to link your Discord and gain access to additional
                                                                        features such as Alert, Staking and other notifications.
                                                                        <br />
                                                                        <br />
                                                                        This step is optional and can be skipped and completed later in
                                                                        settings.
                                                                    </Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                                        <Stack direction="column" justifyContent="center">
                                                            <WalletButton
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => link('discord')}
                                                                sx={{
                                                                    mt: 2,
                                                                    backgroundColor: '#5865F2',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            'hsl(235,calc(var(--saturation-factor, 1)*86.1%),71.8%)'
                                                                    }
                                                                }}
                                                            >
                                                                <img src={DiscordLogo} alt="Discord" width="24" />
                                                                Link Discord
                                                            </WalletButton>

                                                            <WalletButton
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => handleProfileVisit()}
                                                                sx={{ mt: 2 }}
                                                            >
                                                                Visit Dashboard
                                                            </WalletButton>
                                                        </Stack>
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default WalletLogin;
