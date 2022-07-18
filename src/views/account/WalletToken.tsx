import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, IconButton, Typography, Avatar } from '@mui/material';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { formatNumber, formatUSD } from 'utils/utils';
import axios from 'axios';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import SolanaLogo from 'assets/images/icons/solana-logo.png';

interface WalletTokenProps {
    isSolana?: boolean;
    tokenData?: any;
}

const WalletToken = ({ isSolana, tokenData }: WalletTokenProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [priceData, setPriceData] = useState<any>(null);
    const getTokenValue = async () => {
        try {
            if (isSolana) {
                await axios
                    .get('https://public-api.solscan.io/market/token/So11111111111111111111111111111111111111112')
                    .then((res) => {
                        setPriceData(res.data);
                    })
                    .catch((err) => console.log(err));
            } else {
                await axios
                    .get(`https://public-api.solscan.io/market/token/${tokenData.tokenAddress}`)
                    .then((res) => {
                        setPriceData(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [balance, setBalance] = useState(0);
    const fetchBalance = async () => {
        if (publicKey) {
            const solBalance = await connection.getBalance(publicKey, 'confirmed');
            setBalance(solBalance / LAMPORTS_PER_SOL);
        }
    };

    useEffect(() => {
        if (isSolana) {
            fetchBalance();
        }
        getTokenValue();
    }, [fetchBalance]);

    return (
        <>
            <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    p: 0.5,
                    borderRadius: '4px',
                    '&:hover': {
                        cursor: 'pointer',
                        transition: 'all .1s ease-in-out',
                        background: theme.palette.primary.dark
                    }
                }}
                onClick={() => navigate(`/token/solana/${tokenData.tokenAddress}/${tokenData.tokenSymbol}`, { replace: true })}
            >
                <Box display="flex" flexDirection="row">
                    <Avatar
                        src={isSolana ? SolanaLogo : tokenData.tokenIcon}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                        }}
                        color="inherit"
                    />
                    <Stack>
                        <Typography variant="h5" fontWeight="800" sx={{ ml: 1 }}>
                            {isSolana ? 'Solana' : tokenData.tokenName}
                        </Typography>
                        <Typography variant="body1" fontWeight="500" sx={{ ml: 1 }}>
                            {priceData === null || Object.keys(priceData).length === 0 ? 'N/A' : formatUSD.format(priceData.priceUsdt)}
                        </Typography>
                    </Stack>
                </Box>
                <Box display="flex" flexDirection="row">
                    <Stack direction="column" alignItems="flex-end" justifyContent="flex-start" sx={{ mr: 1 }}>
                        {isSolana && priceData !== null && (
                            <Typography variant="h5" fontWeight="800" sx={{ ml: 1 }}>
                                {formatUSD.format(priceData.priceUsdt * balance)}
                            </Typography>
                        )}
                        {!isSolana && (
                            <Typography variant="h5" fontWeight="800" sx={{ ml: 1 }}>
                                {priceData === null || Object.keys(priceData).length === 0
                                    ? 'N/A'
                                    : formatUSD.format(priceData.priceUsdt * tokenData.tokenAmount.uiAmount)}
                            </Typography>
                        )}
                        <Typography variant="body1" fontWeight="500" sx={{ ml: 1 }}>
                            {isSolana && priceData != null
                                ? formatNumber.format(balance)
                                : formatNumber.format(tokenData.tokenAmount.uiAmount)}
                        </Typography>
                    </Stack>
                    <NavigateNextRoundedIcon />
                </Box>
            </Stack>
        </>
    );
};

export default WalletToken;
