import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Avatar, Stack, Box, Button, Typography, TextField, MenuItem, IconButton, Link, CircularProgress } from '@mui/material';
import { StarFilled, BookFilled } from '@ant-design/icons';
import { IconBrandDiscord, IconBrandTwitter, IconWorld } from '@tabler/icons';

// project imports
import MainCard from 'components/MainCard';
import { formatNumber, formatUSD, abbreviateValue, formatPercent } from 'utils/utils';
import { gridSpacing } from 'store/constant';

// third-party
import axios from 'axios';

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

const filter = [
    {
        value: 'market_cap',
        label: 'Market Cap'
    },
    {
        value: 'volume',
        label: 'Volume'
    },
    {
        value: 'holder',
        label: 'Holders'
    },
    {
        value: 'price',
        label: 'Price'
    },
    {
        value: 'price_change_24h',
        label: 'Price Change 24h'
    }
];

// https://api.coingecko.com/api/v3/simple/price?ids=raydium&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true

const TokenDirectory = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // filter
    const [filterValue, setFilterValue] = useState('holder');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);
    const getTopTokens = async () => {
        const tokens: any = [];
        try {
            await axios
                .get(`https://public-api.solscan.io/token/list?sortBy=${filterValue}&direction=desc&limit=25&offset=0`)
                .then((res) => {
                    for (const token of res.data.data) {
                        tokens.push({
                            name: token.tokenName,
                            symbol: token.tokenSymbol,
                            address: token.mintAddress,
                            icon: token.icon,
                            price: token.priceUst,
                            tags: token.tag,
                            marketData: null,
                            holders: token.holder,
                            twitter: token.twitter,
                            website: token.website
                        });
                    }
                    setIsLoading(false);
                    setData(tokens);
                })
                .catch((err) => {
                    console.log(err);
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTopTokens();
    }, []);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ py: 4, mt: 4 }}>
                <Box display="flex" alignItems="flex-start">
                    <Stack sx={{ maxWidth: '36rem' }}>
                        <Typography variant="h1" sx={{ fontWeight: 600 }}>
                            Solana Token Directory
                        </Typography>
                        <Typography variant="h4" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
                            Browse the list of Vaporize supported tokens. By default sorted by the amount of Holders.
                        </Typography>
                    </Stack>
                </Box>
            </Grid>

            {/* toolbar */}
            <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box sx={{ pr: 2, mr: 2, borderRightWidth: '1px' }}>
                        <Button color="primary" size="small" variant="contained" startIcon={<StarFilled />}>
                            Watchlist
                        </Button>
                        <Button sx={{ ml: 1 }} color="primary" size="small" variant="contained" startIcon={<StarFilled />}>
                            Portfolio
                        </Button>
                    </Box>

                    {/* filter */}
                    <TextField
                        select
                        value={filterValue}
                        size="small"
                        sx={{ width: 150, textAlign: 'left', ml: 2 }}
                        onChange={(e) => setFilterValue(e.target.value)}
                    >
                        {filter.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Grid>

            {isLoading && (
                <Grid item xs={12}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ borderRadius: 3, padding: 4, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                    >
                        <Stack alignItems="center">
                            <CircularProgress color="secondary" />
                        </Stack>
                    </Box>
                </Grid>
            )}

            {!isLoading &&
                data &&
                data.map((token: any, index: number) => (
                    <Grid key={index} item xs={12} sx={{ pt: '12px !important' }}>
                        <MainCard
                            boxShadow
                            contentSX={{ p: '8px !important' }}
                            sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale3d(1.02, 1.02, 1)',
                                    transition: '.15s'
                                }
                            }}
                            onClick={() => navigate(`/token/solana/${token.address}/${token.symbol}`)}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Avatar
                                        src={token.icon}
                                        sx={{
                                            ...theme.typography.mediumAvatar,
                                            backgroundColor: 'transparent'
                                        }}
                                        color="inherit"
                                    />
                                    <Stack>
                                        <Typography variant="h4" fontWeight="800" sx={{ ml: 1 }}>
                                            {token.name}
                                        </Typography>
                                        <Typography variant="body2" fontWeight="500" sx={{ ml: 1 }}>
                                            {token.price === null ? 'No Price' : formatUSD.format(token.price)}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Box>
                                    {token.twitter !== '' ? (
                                        <Link href={token.twitter}>
                                            <IconButton size="small" aria-label="close" color="default">
                                                <IconBrandTwitter fontSize="small" />
                                            </IconButton>
                                        </Link>
                                    ) : (
                                        <IconButton size="small" aria-label="close" color="inherit" disabled>
                                            <IconBrandTwitter fontSize="small" />
                                        </IconButton>
                                    )}
                                    {token.website !== '' ? (
                                        <Link href={token.website}>
                                            <IconButton size="small" aria-label="close" color="default">
                                                <IconWorld fontSize="small" />
                                            </IconButton>
                                        </Link>
                                    ) : (
                                        <IconButton size="small" aria-label="close" color="inherit" disabled>
                                            <IconWorld fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Stack>
                        </MainCard>
                    </Grid>
                ))}
        </Grid>
    );
};

export default TokenDirectory;
