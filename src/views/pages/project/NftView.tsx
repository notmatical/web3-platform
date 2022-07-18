import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
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
import { formatPercent, formatNumber, abbreviateValue, ordinal_suffix_of } from 'utils/utils';
import MainCard from 'components/MainCard';

// third-party
import { HyperspaceClient } from 'hyperspace-client-js';

// assets
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import { IconRefresh, IconSearch, IconDiamond } from '@tabler/icons';
import { CloseCircleOutlined, StarFilled } from '@ant-design/icons';
import PlaceholderImage from 'assets/images/placeholder.png';

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
                    actionTypes: ['TRANSACTION']
                }
            })
            .then((res) => {
                setTokenHistory(res.getMarketPlaceActionsByToken);
            });
    };

    useEffect(() => {
        fetchMarketSnapshot();
        fetchTokenState();
        fetchTokenHistory();
    }, []);

    console.log(marketSnapshot);
    console.log(tokenState);
    console.log(tokenHistory);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    sx={{
                        mb: '8px',
                        '&:hover': {
                            color: theme.palette.primary.main,
                            transition: 'all .1s ease-in-out'
                        }
                    }}
                >
                    <IconButton size="small" color="primary" onClick={() => navigate(-1)}>
                        <NavigateBeforeRoundedIcon />
                    </IconButton>
                    <Typography variant="h4" color="primary" sx={{ ml: 1 }}>
                        {marketSnapshot.market_place_snapshots && marketSnapshot.market_place_snapshots[0].project_name}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
                {tokenState.market_place_states && tokenState.market_place_states.length > 0 ? (
                    <>
                        <Box display="flex" flexDirection="row" sx={{ gap: 2 }}>
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

                            <Box display="flex" flexDirection="column" sx={{ py: 2, gap: 1 }}>
                                {/* Project Icon */}
                                <Stack flexDirection="row">
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
                                    <Typography variant="h4" color="inherit" sx={{ ml: 1, textDecoration: 'underline' }}>
                                        {marketSnapshot.market_place_snapshots && marketSnapshot.market_place_snapshots[0].project_name}
                                    </Typography>
                                </Stack>

                                {/* Token Name */}
                                <Typography variant="h3" color="inherit">
                                    {marketSnapshot.market_place_snapshots && marketSnapshot.market_place_snapshots[0].name}
                                </Typography>

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

                                {/* Est Value, Last Sold, */}
                                <Box display="flex" flexDirection="row" sx={{ mt: 2, gap: 4 }}>
                                    <Stack>
                                        <Typography variant="h5" color="primary" fontWeight="600">
                                            Est. Value
                                        </Typography>
                                        <Stack flexDirection="row">
                                            <Tooltip
                                                title={`$${abbreviateValue(
                                                    marketSnapshot.market_place_snapshots[0].rarity_est
                                                        ? marketSnapshot.market_place_snapshots[0].rarity_est
                                                        : 0.01 * solPrice
                                                ).toFixed(1)}`}
                                                placement="bottom"
                                                arrow
                                            >
                                                <Typography variant="h4" color="inherit">
                                                    {/* 500 ◎ */}
                                                    {marketSnapshot.market_place_snapshots[0].rarity_est
                                                        ? marketSnapshot.market_place_snapshots[0].rarity_est.toFixed(2)
                                                        : `< 0.01`}{' '}
                                                    ◎
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
                            </Box>
                        </Box>

                        {/* attributes */}
                        <Box display="flex" flexDirection="row" sx={{ mt: 2, gap: 2 }}>
                            <h1>hi</h1>
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
