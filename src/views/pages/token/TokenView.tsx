import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Avatar, Stack, Box, Button, Typography, Divider, IconButton, Skeleton, CircularProgress, Tooltip } from '@mui/material';

// project imports
import { abbreviateValue, formatPercent } from 'utils/utils';
import { gridSpacing } from 'store/constant';

// third-party
import axios from 'axios';

// assets
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import SolscanLogo from 'assets/images/icons/solscan.png';
import ExplorerLogo from 'assets/images/icons/explorer.png';

const testData = {
    price: '0.88',
    change: '-81.46%',
    cap: '$99.7M',
    volume24: '$24.1M',
    circSupply: '113.3M RAY',
    ATH: '$16.93',
    priceChange1h: '+0.09%',
    priceChange24h: '-1.43%',
    priceChange7d: '-3.22%'
};

// https://api.coingecko.com/api/v3/simple/price?ids=raydium&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true

const TokenView = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { network, tokenAddress, tokenIdentifier } = useParams();

    const [chartData, setChartData] = useState('seven-days');
    const [tokenData, setTokenData] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const getTokenSlugData = async () => {
        try {
            await axios
                .get(`https://public-api.solscan.io/market/token/${tokenAddress}`)
                .then((res) => {
                    console.log(res.data);
                    setTokenData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });

            await axios
                .get(`https://public-api.solscan.io/token/meta?tokenAddress=${tokenAddress}`)
                .then((res) => {
                    setData(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleExplore = (site: string) => {
        switch (site) {
            case 'solscan':
                window.open(`https://solscan.io/token/${tokenAddress}`, '_blank');
                break;
            case 'explorer':
                window.open(`https://explorer.solana.com/address/${tokenAddress}`, '_blank');
                break;
            default:
                window.open(`https://solscan.io/token/${tokenAddress}`, '_blank');
                break;
        }
    };

    console.log(data);

    useEffect(() => {
        getTokenSlugData();
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: '8px',
                        '&:hover': {
                            cursor: 'pointer',
                            color: theme.palette.primary.main,
                            transition: 'all .1s ease-in-out'
                        }
                    }}
                >
                    <IconButton size="small" color="primary">
                        <NavigateBeforeRoundedIcon />
                    </IconButton>
                    <Typography variant="h4" color="primary">
                        Go Back
                    </Typography>
                </Box>

                <Divider />
            </Grid>

            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                    Solana Network
                </Typography>

                {/* icon, name, symbol */}
                <Box display="flex" alignItems="center" flexDirection="row" justifyContent="space-between" sx={{ mb: 1, flex: '1 1' }}>
                    {!data || !tokenData ? (
                        <>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Skeleton variant="circular" animation="wave" width={34} height={34} />
                                <Skeleton variant="text" animation="wave" height={28} width={150} sx={{ ml: 1 }} />
                            </Box>
                            <Box>
                                <Skeleton variant="circular" animation="wave" width={34} height={34} />
                                <Skeleton variant="circular" animation="wave" width={34} height={34} />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <Avatar
                                    src={data && data.icon}
                                    sx={{
                                        ...theme.typography.mediumAvatar,
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer'
                                    }}
                                    color="inherit"
                                />
                                <Typography variant="h2" sx={{ ml: 1 }}>
                                    {data && data.name} ({data && data.symbol})
                                </Typography>
                            </Box>
                            <Box>
                                <Tooltip title="View on Solscan" placement="top" onClick={() => handleExplore('solscan')} arrow>
                                    <img src={SolscanLogo} alt="" width={24} height={24} style={{ marginLeft: 12, cursor: 'pointer' }} />
                                </Tooltip>
                                <Tooltip title="View on Explorer" placement="top" onClick={() => handleExplore('explorer')} arrow>
                                    <img src={ExplorerLogo} alt="" width={24} height={24} style={{ marginLeft: 6, cursor: 'pointer' }} />
                                </Tooltip>
                            </Box>
                        </>
                    )}
                </Box>

                {/* price */}
                <Box display="flex" alignItems="flex-start" sx={{ mb: 2 }}>
                    {!data || !tokenData ? (
                        <>
                            <Skeleton variant="text" animation="wave" height={44} width={150} sx={{ mr: '4px' }} />
                            <Skeleton variant="text" animation="wave" height={24} width={40} />
                        </>
                    ) : (
                        <>
                            <Typography variant="h2" sx={{ fontSize: '36px', mr: '4px', mb: '2px' }}>
                                {tokenData === null || Object.keys(tokenData).length === 0 ? 'N/A' : tokenData.priceUsdt}
                            </Typography>
                            <Typography variant="subtitle1" color="secondary.dark">
                                {tokenData === null || Object.keys(tokenData).length === 0
                                    ? 'N/A'
                                    : formatPercent.format(tokenData.priceChange24h / 100)}
                            </Typography>
                        </>
                    )}
                </Box>
            </Grid>

            {/* chart */}
            <Grid item xs={12}>
                <h1>chart here (WIP)</h1>
            </Grid>

            {/* chart toolbar */}
            <Grid item xs={12} sx={{ pt: '0 !important' }}>
                <Box display="flex" sx={{ gap: 1 }}>
                    <Button
                        size="small"
                        variant={chartData === 'twenty-four' ? 'contained' : 'outlined'}
                        color={chartData === 'twenty-four' ? 'secondary' : 'primary'}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setChartData('twenty-four')}
                    >
                        24h
                    </Button>
                    <Button
                        size="small"
                        variant={chartData === 'seven-days' ? 'contained' : 'outlined'}
                        color={chartData === 'seven-days' ? 'secondary' : 'primary'}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setChartData('seven-days')}
                    >
                        7d
                    </Button>
                    <Button
                        size="small"
                        variant={chartData === 'month' ? 'contained' : 'outlined'}
                        color={chartData === 'month' ? 'secondary' : 'primary'}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setChartData('month')}
                    >
                        30d
                    </Button>
                    <Button
                        size="small"
                        variant={chartData === 'three-month' ? 'contained' : 'outlined'}
                        color={chartData === 'three-month' ? 'secondary' : 'primary'}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setChartData('three-month')}
                    >
                        90d
                    </Button>
                    <Button
                        size="small"
                        variant={chartData === 'year' ? 'contained' : 'outlined'}
                        color={chartData === 'year' ? 'secondary' : 'primary'}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setChartData('year')}
                    >
                        1y
                    </Button>
                </Box>
            </Grid>

            {/* data box */}
            <Grid item xs={12} sx={{ pt: '0 !important' }}>
                <Box
                    sx={{
                        mt: 8,
                        borderRadius: 3,
                        padding: 4,
                        border: '1px solid rgba(213, 217, 233, 0.2)'
                    }}
                >
                    {!data || !tokenData ? (
                        <Stack alignItems="center">
                            <CircularProgress color="secondary" />
                        </Stack>
                    ) : (
                        <>
                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">MARKET CAP</Typography>
                                        <Typography variant="h4">
                                            {tokenData === null || Object.keys(tokenData).length === 0
                                                ? 'N/A'
                                                : abbreviateValue(Math.trunc(tokenData.marketCapFD))}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">VOLUME (24H)</Typography>
                                        <Typography variant="h4">
                                            {tokenData === null || Object.keys(tokenData).length === 0
                                                ? 'N/A'
                                                : abbreviateValue(Math.trunc(tokenData.volumeUsdt))}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">CIRCULATING SUPPLY</Typography>
                                        <Typography variant="h4">
                                            {tokenData === null || Object.keys(tokenData).length === 0
                                                ? 'N/A'
                                                : tokenData.priceUsdt / tokenData.marketCapFD}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Box>

                            <Divider sx={{ mt: 2, mb: 2 }} />

                            <Box display="flex" flexDirection="row" justifyContent="space-between">
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">ALL-TIME HIGH</Typography>
                                        <Typography variant="h4">{testData.ATH}</Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">PRICE CHANGE (1H)</Typography>
                                        <Typography variant="h4" color="success.dark">
                                            {tokenData === null || Object.keys(tokenData).length === 0
                                                ? 'N/A'
                                                : formatPercent.format(tokenData.priceChange24h / 24 / 100)}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">PRICE CHANGE (24H)</Typography>
                                        <Typography variant="h4" color="secondary.dark">
                                            {tokenData === null || Object.keys(tokenData).length === 0
                                                ? 'N/A'
                                                : formatPercent.format(tokenData.priceChange24h / 100)}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Stack>
                                        <Typography variant="subtitle2">PRICE CHANGE (7D)</Typography>
                                        <Typography variant="h4" color="secondary.dark">
                                            {tokenData === null || Object.keys(tokenData).length === 0
                                                ? 'N/A'
                                                : formatPercent.format((tokenData.priceChange24h * 144) / 100)}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default TokenView;
