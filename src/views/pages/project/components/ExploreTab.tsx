import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import {
    Grid,
    Box,
    Stack,
    Chip,
    Fade,
    Divider,
    Button,
    CardMedia,
    CardContent,
    CircularProgress,
    InputAdornment,
    OutlinedInput,
    TextField,
    MenuItem,
    Tooltip,
    Avatar,
    Switch,
    Typography
} from '@mui/material';

// project imports
import { HS_API_KEY } from 'config';
import { useSolPrice } from 'contexts/CoinGecko';
import { formatPercent, formatUSD, abbreviateValue } from 'utils/utils';
import MainCard from 'components/MainCard';

// third-party
import { HyperspaceClient, StringInputOperationEnum } from 'hyperspace-client-js';

// assets
import VerifiedIcon from '@mui/icons-material/Verified';
import { IconRefresh, IconSearch, IconDiamond } from '@tabler/icons';
import { CloseCircleOutlined, StarFilled } from '@ant-design/icons';
import PlaceholderImage from 'assets/images/placeholder.png';

// styles
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    paddingLeft: 16,
    paddingRight: 16,
    background: theme.palette.mode === 'dark' ? '#24182f' : 'transparent',
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('md')]: {
        background: theme.palette.mode === 'dark' ? '#24182f' : 'transparent'
    }
}));

// data
const filter = [
    // {
    //     value: 'lowest_listing_price',
    //     label: 'Price: Low to High'
    // },
    {
        value: 'lowest_listing_price',
        label: 'Price: High to Low'
    },
    {
        value: 'rank_est',
        label: 'Rank: Rare to Common'
    },
    {
        value: 'lowest_listing_block_timestamp',
        label: 'Recently Listed'
    }
];

const ExploreTab = ({ project, projectSlug }: { project: any; projectSlug: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const solPrice = useSolPrice();
    const hsClient = new HyperspaceClient(HS_API_KEY);

    const [value, setValue] = useState<string>('');
    const [filterValue, setFilterValue] = useState('lowest_listing_block_timestamp');
    const [autoRefresh, setAutoRefresh] = useState(false);

    const [marketSnapshot, setMarketSnapshot] = useState<any>([]);
    const fetchMarketSnapshot = async () => {
        hsClient
            .getMarketplaceSnapshot({
                condition: {
                    projects: [
                        {
                            project_id: projectSlug!
                        }
                    ]
                },
                orderBy: {
                    field_name: filterValue,
                    sort_order: 'DESC'
                },
                paginationInfo: {
                    page_number: 1,
                    page_size: 30
                }
            })
            .then((res) => {
                setMarketSnapshot(res.getMarketPlaceSnapshots);
            });
    };

    useEffect(() => {
        fetchMarketSnapshot();
    }, []);

    console.log(marketSnapshot);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ px: 2, flexGrow: 1 }}>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexGrow: 1 }}>
                        {/* <IconButton size="small" sx={{ border: `1px solid ${theme.palette.primary.dark}` }}>
                            <IconRefresh color={theme.palette.primary.dark} />
                        </IconButton> */}
                        <OutlineInputStyle
                            id="input-search-collection"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Filter by name or token id"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                                </InputAdornment>
                            }
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'weight' }}
                        />
                        <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                            <TextField
                                select
                                value={filterValue}
                                size="small"
                                sx={{ width: 195, textAlign: 'left' }}
                                onChange={(e) => setFilterValue(e.target.value)}
                            >
                                {filter.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Stack flexDirection="row" alignItems="center">
                                <Switch
                                    sx={{ mt: '0px !important' }}
                                    color="secondary"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <Typography variant="caption" textAlign="center">
                                    Auto Refresh
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Grid>

            <Grid item xs={12}>
                {marketSnapshot.market_place_snapshots && marketSnapshot.market_place_snapshots.length > 0 ? (
                    <Grid container spacing={2}>
                        {marketSnapshot.market_place_snapshots.map((nft: any, index: number) => (
                            <Grid key={index} item xs={6} sm={4} md={3} lg={3}>
                                <MainCard
                                    content={false}
                                    onClick={() => navigate(`/nft/${projectSlug}/explore/${nft.token_address}`)}
                                    sx={{
                                        borderRadius: 4,
                                        '&:hover': {
                                            cursor: 'pointer',
                                            boxShadow: `0 0 0 4px ${theme.palette.primary.dark}`
                                        }
                                    }}
                                >
                                    <Chip
                                        label={`#${nft.rank_est}`}
                                        size="small"
                                        color="warning"
                                        icon={<StarFilled style={{ fontSize: 14 }} />}
                                        sx={{
                                            position: 'absolute',
                                            left: '8px',
                                            top: '8px',
                                            borderRadius: 3,
                                            zIndex: 500,
                                            backgroundColor: theme.palette.warning.dark,
                                            '&:hover': {
                                                cursor: 'pointer'
                                            },
                                            '& .MuiChip-label': {
                                                pl: '6px !important',
                                                fontWeight: 700
                                            }
                                        }}
                                    />
                                    <Fade in timeout={500} unmountOnExit>
                                        <CardMedia
                                            image={nft.meta_data_img ? nft.meta_data_img : PlaceholderImage}
                                            title={nft.name}
                                            sx={{
                                                height: 220,
                                                maxHeight: '220px !important',
                                                transform: 'scale3d(1, 1, 1) translateY(0px)',
                                                transition: 'all .65s ease !important',
                                                '&:hover': {
                                                    transform: 'scale3d(1.16, 1.16, 1) translateY(-15px)',
                                                    transition: 'all .65s ease !important'
                                                }
                                            }}
                                        />
                                    </Fade>
                                    <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                                        <Box display="flex" flexDirection="column">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Typography variant="subtitle1" color="secondary">
                                                    {nft.project_name}
                                                </Typography>
                                                {nft.is_project_verified && (
                                                    <Tooltip title="Verified" placement="top" arrow>
                                                        <VerifiedIcon
                                                            fontSize="inherit"
                                                            style={{
                                                                color: theme.palette.secondary.main,
                                                                marginLeft: 2
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Box>
                                            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h4" color="inherit">
                                                    {nft.name}
                                                </Typography>
                                                {nft.lowest_listing_mpa !== null && (
                                                    <Tooltip
                                                        title={`$${abbreviateValue(nft.lowest_listing_mpa.price * solPrice)}`}
                                                        placement="top"
                                                        arrow
                                                    >
                                                        <Typography variant="h4" color="info.dark">
                                                            {nft.lowest_listing_mpa.price} ◎
                                                        </Typography>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                            <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ mt: 1 }}>
                                                <Stack>
                                                    <Typography variant="h5" color="primary" fontWeight="600">
                                                        Est. Value
                                                    </Typography>
                                                    <Stack flexDirection="row">
                                                        <Tooltip
                                                            title={`$${abbreviateValue(
                                                                nft.rarity_est ? nft.rarity_est : 0.01 * solPrice
                                                            ).toFixed(1)}`}
                                                            placement="top"
                                                            arrow
                                                        >
                                                            <Typography variant="h4" color="inherit">
                                                                {/* 500 ◎ */}
                                                                {nft.rarity_est ? nft.rarity_est.toFixed(2) : `< 0.01`} ◎
                                                            </Typography>
                                                        </Tooltip>
                                                        <Tooltip title="% change from last sale" placement="top" arrow>
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
                                                    <Tooltip title={`$${abbreviateValue(0.7 * solPrice).toFixed(1)}`} placement="top" arrow>
                                                        <Typography variant="h4" color="inherit">
                                                            TBD ◎
                                                        </Typography>
                                                    </Tooltip>
                                                </Stack>
                                            </Box>

                                            <Divider sx={{ mt: 1, mb: 1 }} />

                                            <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ gap: 2 }}>
                                                {nft.lowest_listing_mpa !== null ? (
                                                    <Button variant="contained" color="secondary" fullWidth>
                                                        Buy
                                                    </Button>
                                                ) : (
                                                    <Button variant="contained" color="secondary" fullWidth>
                                                        Make Offer
                                                    </Button>
                                                )}
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </MainCard>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress color="secondary" />
                    </Box>
                )}
            </Grid>

            {marketSnapshot.market_place_snapshots && marketSnapshot.market_place_snapshots.length === 0 && (
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

export default ExploreTab;
