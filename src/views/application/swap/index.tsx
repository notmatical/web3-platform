import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import { Grid, Divider, Stack, Box, Avatar, Button, Typography, Tooltip, OutlinedInput, Dialog } from '@mui/material';

// third-party
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useJupiter, RouteInfo } from '@jup-ag/react-hook';
import { TOKEN_LIST_URL } from '@jup-ag/core';
import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import JSBI from 'jsbi';

// project imports
import { gridSpacing } from 'store/constant';
import { Token } from 'types/swap';
import SwapTokenSelect from './components/SwapTokenSelect';
import AnimateButton from 'components/@extended/AnimateButton';
import CollabsPlaceholder from 'components/cards/Skeleton/CollabsPlaceholder';

// assets
import SolanaChain from 'assets/images/blockchains/solana-icon.png';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { IconChevronDown, IconArrowsSort, IconSwitchHorizontal } from '@tabler/icons';

// styled components
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: '100%',
    marginTop: '0 !important',
    maxWidth: '200px',
    borderRadius: '16px',
    gap: '4px',
    '& input': {
        fontSize: '30px',
        fontWeight: 500,
        textAlign: 'right',
        padding: '4px 12px',
        background: 'transparent !important'
    }
}));

type UseJupiterProps = Parameters<typeof useJupiter>[0];
type UseFormValue = Omit<UseJupiterProps, 'amount'> & {
    amount: null | number;
};

const Swap = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { wallet, publicKey, connected, signAllTransactions, signTransaction } = useWallet();

    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [swapping, setSwapping] = useState(false);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
    const [tokenPrices, setTokenPrices] = useState<any | null>(null);
    const [coinGeckoList, setCoinGeckoList] = useState<any[] | null>(null);
    const [walletTokens, setWalletTokens] = useState<any[]>([]);

    // tx settings
    const [slippage, setSlippage] = useState(0.5);
    const [feeValue, setFeeValue] = useState<number | null>(null);
    const [swapRate, setSwapRate] = useState(false);

    const [formValue, setFormValue] = useState<UseFormValue>({
        amount: null,
        inputMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
        outputMint: new PublicKey('MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac'),
        slippage
    });

    // eslint-disable-next-line arrow-body-style
    const [inputTokenInfo, outputTokenInfo] = useMemo(() => {
        return [
            tokens.find((item) => item?.address === formValue.inputMint?.toBase58() || ''),
            tokens.find((item) => item?.address === formValue.outputMint?.toBase58() || '')
        ];
    }, [formValue.inputMint?.toBase58(), formValue.outputMint?.toBase58(), tokens]);

    // methods
    // const amountInDecimal = useMemo(() => {
    //     if (typeof formValue?.amount === 'number') {
    //         return formValue.amount * 10 ** (inputTokenInfo?.decimals || 1);
    //     }
    // }, [inputTokenInfo, formValue.amount]);

    const { routeMap, routes, loading, exchange, error, refresh } = useJupiter({
        ...formValue,
        // amount: amountInDecimal ? amountInDecimal : 0,
        amount: JSBI.BigInt(1 * 10 ** 6),
        slippage
    });

    const sortedTokenMints = sortBy(tokens, (token) => token?.symbol.toLowerCase());

    // const outAmountUi = selectedRoute ? selectedRoute.outAmount / 10 ** (outputTokenInfo?.decimals || 1) : null

    const swapDisabled = loading || !selectedRoute || routes?.length === 0;

    const inputTokenInfos = inputTokenInfo ? (inputTokenInfo as any) : null;
    const outputTokenInfos = outputTokenInfo ? (outputTokenInfo as any) : null;

    // effects
    useEffect(() => {
        // Fetch token list from Jupiter API
        fetch(TOKEN_LIST_URL['mainnet-beta'])
            .then((res) => res.json())
            .then((result) => setTokens(result));
    }, []);

    useEffect(() => {
        const fetchCoinGeckoList = async () => {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
            const data = await response.json();
            setCoinGeckoList(data);
        };

        fetchCoinGeckoList();
    }, []);

    // useEffect(() => {
    //     if (connected) {
    //         fetchWalletTokens();
    //     }
    // }, [connected, fetchWalletTokens]);

    console.log(tokens);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 5 }}>
                    <Box
                        sx={{
                            width: 'min(456px, 100%)',
                            borderRadius: 3,
                            padding: '1.2px',
                            background: 'linear-gradient(var(--gradient-rotate, 246deg), #da2eef 7.97%, #2b6aff 49.17%, #39d0d8 92.1%)'
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                padding: 2,
                                borderRadius: 3,
                                background: theme.palette.background.paper
                            }}
                        >
                            {connected && (
                                <Box
                                    display="flex"
                                    justifyContent="flex-start"
                                    sx={{
                                        mb: 2,
                                        borderRadius: 3,
                                        padding: 2,
                                        background: 'rgba(255, 255, 255, 0.04)'
                                    }}
                                >
                                    <Stack alignItems="flex-start">
                                        <Typography variant="h5" color="inherit">
                                            Wallet not connected
                                        </Typography>
                                        <Typography variant="caption" color="inherit">
                                            You are currently viewing 45rzLU...BDFg
                                        </Typography>
                                        <Button color="secondary" size="small" variant="contained" sx={{ borderRadius: '16px', mt: 1 }}>
                                            Connect
                                        </Button>
                                    </Stack>
                                </Box>
                            )}

                            <Box sx={{ mb: 1 }}>
                                <Box display="flex">
                                    <Typography variant="caption" color="inherit" sx={{ flex: '1 1' }}>
                                        From
                                    </Typography>
                                    <Typography variant="caption" color="inherit">
                                        Max: 0
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" sx={{ py: 0.5 }}>
                                    <Box display="flex" alignItems="center" onClick={handleOpen} sx={{ mr: 1 }}>
                                        <Avatar
                                            src={SolanaChain}
                                            sx={{
                                                borderRadius: '9999px',
                                                mr: 0.5,
                                                height: '32px',
                                                width: '32px',
                                                backgroundColor: 'transparent'
                                            }}
                                            color="inherit"
                                        />
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            sx={{
                                                transition: '.3s',
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    transition: '.3s',
                                                    color: '#c7d2da'
                                                }
                                            }}
                                        >
                                            <Typography variant="h3" fontWeight="500" color="inherit">
                                                SOL
                                            </Typography>
                                            <IconChevronDown size="1.5rem" />
                                        </Box>
                                    </Box>
                                    <OutlineInputStyle
                                        id="input-search-header"
                                        type="tel"
                                        value={1}
                                        fullWidth
                                        onChange={(e: any) => console.log(e.target.value)}
                                        placeholder="0"
                                        sx={{ marginTop: '24px', marginLeft: 0 }}
                                        aria-describedby="search-helper-text"
                                        inputProps={{ 'aria-label': 'weight', pattern: '[0-9]*' }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="flex-end">
                                    <Typography variant="caption" color="inherit">
                                        ≈ $48.16
                                    </Typography>
                                </Box>

                                {/* middle icon */}
                                <Box display="flex" justifyContent="flex-start" sx={{ position: 'relative', mb: 1 }}>
                                    <Divider sx={{ width: 'calc(100% - 40px)', position: 'absolute', top: '19px', right: 0, zIndex: 1 }} />
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            borderRadius: '9999px',
                                            height: '40px',
                                            width: '40px',
                                            opacity: '0.5',
                                            backgroundColor: theme.palette.secondary.main
                                        }}
                                        color="inherit"
                                    >
                                        <IconArrowsSort size="1.3rem" color="#FFF" />
                                    </Avatar>
                                </Box>

                                {/* recieve */}
                                <Box display="flex" alignItems="center">
                                    <Typography variant="caption" color="inherit" sx={{ flex: '1 1' }}>
                                        To
                                    </Typography>
                                    <Typography variant="caption" color="inherit">
                                        1 SOL = 1,508 YAKU
                                    </Typography>
                                    <IconSwitchHorizontal size="1em" style={{ marginLeft: 2 }} />
                                </Box>
                                <Box display="flex" justifyContent="space-between" sx={{ py: 0.5 }}>
                                    <Box display="flex" alignItems="center" sx={{ mr: 1 }}>
                                        <Avatar
                                            src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EK58dp4mxsKwwuySWQW826i3fwcvUK69jPph22VUcd2H/logo.png"
                                            sx={{
                                                borderRadius: '9999px',
                                                mr: 0.5,
                                                height: '32px',
                                                width: '32px',
                                                backgroundColor: 'transparent'
                                            }}
                                            color="inherit"
                                        />
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            sx={{
                                                transition: '.3s',
                                                '&:hover': {
                                                    cursor: 'pointer',
                                                    transition: '.3s',
                                                    color: '#c7d2da'
                                                }
                                            }}
                                        >
                                            <Typography variant="h3" fontWeight="500" color="inherit">
                                                YAKU
                                            </Typography>
                                            <IconChevronDown size="1.5rem" />
                                        </Box>
                                    </Box>
                                    <OutlineInputStyle
                                        id="input-search-header"
                                        type="tel"
                                        value="1,508"
                                        fullWidth
                                        onChange={(e: any) => console.log(e.target.value)}
                                        placeholder="0"
                                        sx={{ marginTop: '24px', marginLeft: 0 }}
                                        aria-describedby="search-helper-text"
                                        inputProps={{ 'aria-label': 'weight', pattern: '[0-9]*' }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="flex-end">
                                    <Typography variant="caption" color="inherit">
                                        ≈ $0.00
                                    </Typography>
                                </Box>
                            </Box>

                            {/* transaction settings */}
                            <Box sx={{ pt: 1, mb: 1 }}>
                                <Typography variant="caption" color="inherit" fontWeight="500">
                                    Transaction Settings
                                </Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" flexDirection="column" sx={{ gap: 1, py: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="caption" color="inherit">
                                            Slippage Tolerance
                                        </Typography>
                                        <Tooltip
                                            title="This is maximum percentage you are willing to lose due to unfavorable price changes."
                                            placement="top"
                                            arrow
                                        >
                                            <InfoOutlinedIcon fontSize="inherit" style={{ marginLeft: 2 }} />
                                        </Tooltip>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="caption" color="inherit">
                                            3.00%
                                        </Typography>
                                        <BorderColorOutlinedIcon fontSize="inherit" style={{ marginLeft: 2 }} />
                                    </Box>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Typography variant="caption" color="inherit">
                                            Allowance
                                        </Typography>
                                        <Tooltip
                                            title="Only the exact amount is allowed to be transferred. You will need to reapprove for a subsequent transaction."
                                            placement="top"
                                            arrow
                                        >
                                            <InfoOutlinedIcon fontSize="inherit" style={{ marginLeft: 2 }} />
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="caption" color="inherit">
                                        Exact Amount
                                    </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="caption" color="inherit">
                                        Swap Fee
                                    </Typography>
                                    <Typography variant="caption" color="inherit">
                                        ≈ $0.00
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" sx={{ mt: 2 }}>
                                <Button color="secondary" size="large" variant="contained" disabled fullWidth sx={{ borderRadius: 3 }}>
                                    Exchange
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Dialog renders its body even if not open */}
                <Dialog maxWidth="xs" fullWidth onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                    {open && <SwapTokenSelect sortedTokenMints={null} onClose={handleClose} />}
                </Dialog>
            </Grid>
        </Grid>
    );
};

export default Swap;
