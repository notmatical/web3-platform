import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Grid,
    Box,
    Stack,
    Chip,
    Fade,
    CardMedia,
    CardContent,
    CircularProgress,
    Divider,
    Tooltip,
    Avatar,
    IconButton,
    Typography
} from '@mui/material';

// project imports
import { HS_API_KEY } from 'config';
import { useSolPrice } from 'contexts/CoinGecko';
import { formatPercent, formatNumber, abbreviateValue, ordinal_suffix_of, shortenAddress, formatDate } from 'utils/utils';
import MainCard from 'components/MainCard';

// third-party
import { HyperspaceClient, MarketplaceActionEnums } from 'hyperspace-client-js';

// assets
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { IconRefresh, IconExternalLink, IconDiamond } from '@tabler/icons';
import { CloseCircleOutlined, StarFilled } from '@ant-design/icons';
import PlaceholderImage from 'assets/images/placeholder.png';
import MagicEden from 'assets/images/icons/me-logo.svg';

const NftView = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const solPrice = useSolPrice();
    const { projectSlug, tab, tokenAddress } = useParams();

    console.log(projectSlug, tokenAddress);

    const hsClient = new HyperspaceClient(HS_API_KEY);

    const [marketSnapshot, setMarketSnapshot] = useState<any>([]);
    const fetchMarketSnapshot = async () => {
        hsClient
            .getMarketplaceSnapshot({
                condition: {
                    tokenAddresses: [tokenAddress!]
                }
            })
            .then((res) => {
                setMarketSnapshot(res.getMarketPlaceSnapshots);
            });
    };

    const [tokenState, setTokenState] = useState<any>([]);
    const fetchTokenState = async () => {
        hsClient
            .getTokenState({
                condition: {
                    tokenAddresses: [tokenAddress!]
                }
            })
            .then((res) => {
                setTokenState(res.getTokenState[0]);
            });
    };

    const [tokenHistory, setTokenHistory] = useState<any>([]);
    const fetchTokenHistory = async () => {
        hsClient
            .getTokenHistory({
                condition: {
                    tokenAddresses: [tokenAddress!],
                    actionType: 'TRANSACTION' as MarketplaceActionEnums
                }
            })
            .then((res) => {
                console.log(res);
                setTokenHistory(res.getMarketPlaceActionsByToken);
            });
    };

    useEffect(() => {
        fetchMarketSnapshot();
        fetchTokenState();
        fetchTokenHistory();
    }, []);

    console.log(tokenHistory);
    console.log(marketSnapshot);
    console.log(tokenState);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {/* <CardMedia
                    image={tokenState.length === 0 ? PlaceholderImage : tokenState.market_place_states[0].meta_data_img}
                    sx={{
                        overflow: 'hidden',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        // filter: 'blur(16px)',
                        opacity: '0.5',
                        height: 300,
                        ml: '-20px',
                        mr: '-20px',
                        mt: '-20px'
                    }}
                >
                    <Box
                        sx={{
                            zIndex: -1,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(360deg, #0b0f19 10%, rgba(20, 26, 30, 0) 100%)'
                        }}
                    />
                </CardMedia> */}

                {tokenState.market_place_states && tokenState.market_place_states.length > 0 ? (
                    <>
                        <Box display="flex" flexDirection="row" sx={{ gap: 2 }}>
                            {/* sx={{ gap: 2, mt: '-25%' }} */}
                            <Box display="flex" flexDirection="column" sx={{ gap: 2 }}>
                                {/* Avatar */}
                                <Fade in timeout={500} unmountOnExit>
                                    <Avatar
                                        src={
                                            tokenState.market_place_states[0].meta_data_img === null
                                                ? PlaceholderImage
                                                : tokenState.market_place_states[0].meta_data_img
                                        }
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            height: '320px',
                                            width: '320px',
                                            backgroundColor: 'transparent'
                                        }}
                                        color="inherit"
                                    />
                                </Fade>
                                <Box
                                    display="block"
                                    sx={{
                                        background: '#111827',
                                        p: 1,
                                        borderRadius: 2
                                    }}
                                >
                                    <Box display="flex" flexDirection="column" sx={{ gap: 1 }}>
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography variant="subtitle1" color="primary">
                                                Token ID
                                            </Typography>
                                            <Typography variant="subtitle1" color="inherit">
                                                1
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography variant="subtitle1" color="primary">
                                                Address
                                            </Typography>
                                            <Typography variant="subtitle1" color="inherit">
                                                {tokenState && shortenAddress(tokenState.token_address, 6)}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography variant="subtitle1" color="primary">
                                                Description
                                            </Typography>
                                            <Typography variant="subtitle1" color="inherit">
                                                1
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box display="flex" flexDirection="column" sx={{ gap: 3, flexGrow: 1, zIndex: 1 }}>
                                <Box display="flex" flexDirection="column" sx={{ gap: 1 }}>
                                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                                        {/* collection family / token name */}
                                        <Stack>
                                            <Stack flexDirection="row" alignItems="center">
                                                <Fade in timeout={500} unmountOnExit>
                                                    <Avatar
                                                        src={
                                                            marketSnapshot.length === 0
                                                                ? PlaceholderImage
                                                                : marketSnapshot.market_place_snapshots[0].project_image
                                                        }
                                                        sx={{
                                                            borderRadius: '9999px',
                                                            height: '20px',
                                                            width: '20px',
                                                            backgroundColor: 'transparent'
                                                        }}
                                                        color="inherit"
                                                    />
                                                </Fade>
                                                <Typography variant="subtitle1" color="inherit" sx={{ ml: 1, textDecoration: 'underline' }}>
                                                    {marketSnapshot.market_place_snapshots &&
                                                        marketSnapshot.market_place_snapshots[0].project_name}
                                                </Typography>
                                            </Stack>

                                            <Typography variant="h3" color="inherit">
                                                {marketSnapshot.market_place_snapshots && marketSnapshot.market_place_snapshots[0].name}
                                            </Typography>
                                        </Stack>

                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            sx={{
                                                gap: 1,
                                                background: '#111827',
                                                p: 0.5,
                                                borderRadius: 2
                                            }}
                                        >
                                            <IconButton
                                                sx={{
                                                    background: '#202a30',
                                                    width: '33px',
                                                    height: '33px'
                                                }}
                                            >
                                                <IconRefresh color="#FFF" />
                                            </IconButton>
                                            <IconButton
                                                sx={{
                                                    background: '#202a30',
                                                    width: '33px',
                                                    height: '33px'
                                                }}
                                            >
                                                <Avatar
                                                    alt="Marketplace Image"
                                                    src={MagicEden}
                                                    sx={{
                                                        width: 33,
                                                        height: 33,
                                                        background: '#0b0f19'
                                                    }}
                                                />
                                            </IconButton>
                                            <IconButton
                                                sx={{
                                                    background: '#202a30',
                                                    width: '33px',
                                                    height: '33px'
                                                }}
                                            >
                                                <IconExternalLink color="#FFF" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    {/* Current Owner */}
                                    <Stack flexDirection="row">
                                        <Typography variant="h5" color="primary">
                                            Owned By
                                        </Typography>
                                        <Avatar
                                            src="https://arweave.net/u2z_FPvnPsCzgC6wbGc_IADr8KPO627-p6Ar3KAB7QE/7003.png"
                                            sx={{
                                                borderRadius: '9999px',
                                                height: '20px',
                                                width: '20px',
                                                backgroundColor: 'transparent',
                                                ml: 0.5,
                                                '&:hover': {
                                                    cursor: 'pointer'
                                                }
                                            }}
                                            color="inherit"
                                        />
                                        <Typography
                                            variant="h5"
                                            color="secondary"
                                            onClick={() => navigate(`/account/45rzLU1gPiEsaDtmkjvawgKDYYpSTHdVXKJjZ74dBDFg/portfolio`)}
                                            sx={{
                                                ml: 0.5,
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    cursor: 'pointer'
                                                }
                                            }}
                                        >
                                            matical.sol
                                        </Typography>
                                    </Stack>
                                </Box>

                                {/* Est Value, Last Sold, */}
                                <Box display="flex" flexDirection="row" sx={{ gap: 4 }}>
                                    <Stack>
                                        <Typography variant="h5" color="primary" fontWeight="600">
                                            Est. Value
                                        </Typography>
                                        <Stack flexDirection="row">
                                            <Tooltip title={`$${abbreviateValue(0.01 * solPrice).toFixed(1)}`} placement="bottom" arrow>
                                                <Typography variant="h4" color="inherit">
                                                    120 ◎ {/* < 0.01 ◎ */}
                                                </Typography>
                                            </Tooltip>
                                            <Tooltip title="% change from last sale" placement="bottom" arrow>
                                                <Typography variant="h5" color="success.main" sx={{ ml: 0.5 }}>
                                                    +{formatPercent.format(0.084)}
                                                </Typography>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>

                                    <Stack>
                                        <Typography variant="h5" color="primary" fontWeight="600">
                                            Last Sale
                                        </Typography>
                                        <Tooltip title={`$${abbreviateValue(0.7 * solPrice).toFixed(1)}`} placement="bottom" arrow>
                                            <Typography variant="h4" color="inherit">
                                                500 ◎
                                            </Typography>
                                        </Tooltip>
                                    </Stack>

                                    <Stack>
                                        <Typography variant="h5" color="primary" fontWeight="600">
                                            Rarity
                                        </Typography>
                                        <Stack flexDirection="row">
                                            <Typography variant="h4" color="inherit">
                                                {ordinal_suffix_of(marketSnapshot.market_place_snapshots[0].rank_est)}
                                            </Typography>
                                            <Typography variant="body1" color="primary" fontWeight="700" sx={{ ml: 0.5 }}>
                                                /{formatNumber.format(marketSnapshot.market_place_snapshots[0].supply)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* properties / owner history */}
                                <Box display="flex" flexDirection="column" sx={{ pt: 2, gap: 2 }}>
                                    <Typography variant="h5" color="primary" fontWeight="600">
                                        Properties
                                    </Typography>
                                    <Box display="flex" sx={{ gap: 2, gridTemplateColumns: 'repeat(3, minmax(0, 1fr)' }}>
                                        {marketSnapshot.market_place_snapshots &&
                                            marketSnapshot.market_place_snapshots.length > 0 &&
                                            marketSnapshot.market_place_snapshots.map((nft: any, index: number) => (
                                                <Box display="flex" sx={{ p: 1, flexGrow: 1, borderRadius: 2, background: '#111827' }}>
                                                    <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
                                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                                            <Typography variant="h5" color="primary" fontWeight="600">
                                                                {nft.project_id}
                                                            </Typography>
                                                            <Typography variant="h5" color="primary" fontWeight="600">
                                                                74.58 ◎
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="h5" color="primary" fontWeight="600">
                                                            Relic Book Page
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                    </Box>
                                </Box>

                                {/* <Box display="flex" sx={{ p: 1, flexGrow: 1, borderRadius: 2, background: '#111827' }}>
                                    <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography variant="h5" color="primary" fontWeight="600">
                                                Test Trait
                                            </Typography>
                                            <Typography variant="h5" color="primary" fontWeight="600">
                                                74.58 ◎
                                            </Typography>
                                        </Box>
                                        <Typography variant="h5" color="primary" fontWeight="600">
                                            Relic Book Page
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" sx={{ p: 1, flexGrow: 1, borderRadius: 2, background: '#111827' }}>
                                    <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
                                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                                            <Typography variant="h5" color="primary" fontWeight="600">
                                                Test Trait
                                            </Typography>
                                            <Typography variant="h5" color="primary" fontWeight="600">
                                                74.58 ◎
                                            </Typography>
                                        </Box>
                                        <Typography variant="h5" color="primary" fontWeight="600">
                                            Relic Book Page
                                        </Typography>
                                    </Box>
                                </Box> */}

                                {/* // <Box display="flex" justifyContent="center" alignItems="center">
                                //     <CircularProgress color="secondary" />
                                // </Box> */}

                                <Box display="flex" flexDirection="column" sx={{ gap: 1 }}>
                                    <Typography variant="h5" color="primary" fontWeight="600">
                                        Owner History
                                    </Typography>

                                    <Box display="flex" flexDirection="column" sx={{ gap: 2 }}>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            sx={{
                                                p: 1,
                                                gap: 1,
                                                flexGrow: 1,
                                                borderRadius: 2,
                                                background: '#111827'
                                            }}
                                        >
                                            <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ flexGrow: 1 }}>
                                                <Stack flexDirection="row" sx={{ gap: 1 }}>
                                                    <Avatar
                                                        src="https://arweave.net/u2z_FPvnPsCzgC6wbGc_IADr8KPO627-p6Ar3KAB7QE/7003.png"
                                                        sx={{
                                                            borderRadius: '9999px',
                                                            height: '36px',
                                                            width: '36px',
                                                            backgroundColor: 'transparent',
                                                            '&:hover': {
                                                                cursor: 'pointer'
                                                            }
                                                        }}
                                                        color="inherit"
                                                    />
                                                    <Stack>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                textDecoration: 'underline',
                                                                '&:hover': {
                                                                    cursor: 'pointer'
                                                                }
                                                            }}
                                                        >
                                                            matical.sol
                                                        </Typography>
                                                        <Typography variant="h5" color="inherit">
                                                            Owned for 3 days
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack alignItems="flex-end">
                                                    <Typography variant="h5" color="inherit">
                                                        July 24, 2022
                                                    </Typography>
                                                    <Typography variant="h5" color="inherit">
                                                        Transfer
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>
                                        {tokenHistory.length > 0 &&
                                            tokenHistory[0].market_place_actions.map((history: any, index: number) => (
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    sx={{
                                                        p: 1,
                                                        gap: 1,
                                                        flexGrow: 1,
                                                        borderRadius: 2,
                                                        background: '#111827'
                                                    }}
                                                >
                                                    <Box
                                                        display="flex"
                                                        flexDirection="row"
                                                        justifyContent="space-between"
                                                        sx={{ flexGrow: 1 }}
                                                    >
                                                        <Stack flexDirection="row" sx={{ gap: 1 }}>
                                                            <Avatar
                                                                src={PlaceholderImage}
                                                                sx={{
                                                                    borderRadius: '9999px',
                                                                    height: '36px',
                                                                    width: '36px',
                                                                    backgroundColor: 'transparent',
                                                                    '&:hover': {
                                                                        cursor: 'pointer'
                                                                    }
                                                                }}
                                                                color="inherit"
                                                            />
                                                            <Stack>
                                                                <Typography
                                                                    variant="h5"
                                                                    sx={{
                                                                        textDecoration: 'underline',
                                                                        '&:hover': {
                                                                            cursor: 'pointer'
                                                                        }
                                                                    }}
                                                                >
                                                                    {shortenAddress(history.buyer_address, 4)}
                                                                </Typography>
                                                                <Typography variant="h5" color="inherit">
                                                                    Owned for 3 days
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                        <Stack alignItems="flex-end">
                                                            <Typography variant="h5" color="inherit">
                                                                {formatDate.format(new Date(history.block_timestamp * 1000))}
                                                            </Typography>
                                                            <Typography variant="h5" fontWeight="600" color="inherit">
                                                                Bought for {history.price} SOL
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                </Box>
                                            ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress color="secondary" />
                    </Box>
                )}
            </Grid>

            {tokenState.market_place_states && tokenState.market_place_states.length === 0 && (
                <Grid item xs={12}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ borderRadius: 3, padding: 4, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                    >
                        <Stack alignItems="center">
                            <Avatar
                                variant="rounded"
                                sx={{
                                    borderRadius: '9999px',
                                    width: '80px !important',
                                    height: '80px !important',
                                    backgroundColor: theme.palette.dark.main,
                                    color: theme.palette.secondary.dark,
                                    mb: 2
                                }}
                            >
                                <CloseCircleOutlined style={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h3" color="inherit">
                                No Collection Data Found
                            </Typography>
                            <Typography variant="subtitle2" color="inherit">
                                There are no nfts to display.
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default NftView;
