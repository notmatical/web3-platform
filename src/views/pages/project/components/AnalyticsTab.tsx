import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { shouldForwardProp } from '@mui/system';
import {
    Grid,
    Box,
    Stack,
    Divider,
    Button,
    Tooltip,
    Avatar,
    Chip,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    CircularProgress,
    Fade
} from '@mui/material';

// project imports
import { HS_API_KEY } from 'config';
import { useSolPrice } from 'contexts/CoinGecko';
import { relativeTimeFromDates, formatUSD, shortenAddress } from 'utils/utils';
import MainCard from 'components/MainCard';

// third-party
import { HyperspaceClient, MarketplaceActionEnums } from 'hyperspace-client-js';

// assets
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import {
    IconActivity,
    IconCoin,
    IconTag,
    IconArrowUpRight,
    IconLayoutGrid,
    IconArchive,
    IconFingerprint,
    IconAlertTriangle
} from '@tabler/icons';
import { CloseCircleOutlined, StarFilled } from '@ant-design/icons';
import PlaceholderImage from 'assets/images/placeholder.png';
import MagicEden from 'assets/images/icons/me-logo.svg';
import OpenseaLogo from 'assets/images/icons/opensea.svg';
import YawwwLogo from 'assets/images/icons/yawww.jpg';
import SolanaFMLogo from 'assets/images/icons/solanafm.png';
import SolscanLogo from 'assets/images/icons/solscan.png';
import ExplorerLogo from 'assets/images/icons/explorer.png';

const AnalyticsTab = ({ project, projectSlug }: { project: any; projectSlug: any }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const solPrice = useSolPrice();
    const hsClient = new HyperspaceClient(HS_API_KEY);

    const [filter, setFilter] = useState('all');

    const [activities, setActivities] = useState<any>([]);
    const fetchUserHistory = async () => {
        hsClient
            .getProjectHistory({
                condition: {
                    projects: [{ project_id: projectSlug! }],
                    actionTypes: ['TRANSACTION', 'BID', 'CANCELBID', 'LISTING', 'DELISTING', 'UPDATELISTING'] as MarketplaceActionEnums[]
                },
                paginationInfo: {
                    progressive_load: true
                }
            })
            .then((res) => {
                console.log(res.getProjectHistory);
                setActivities(res.getProjectHistory);
            });
    };

    // Helpers
    const handleExplore = (site: string, tx: any) => {
        switch (site) {
            case 'solscan':
                window.open(`https://solscan.io/tx/${tx}`, '_blank');
                break;
            case 'explorer':
                window.open(`https://explorer.solana.com/tx/${tx}`, '_blank');
                break;
            case 'solanafm':
                window.open(`https://solana.fm/tx/${tx}`, '_blank');
                break;
            default:
                window.open(`https://solscan.io/tx/${tx}`, '_blank');
                break;
        }
    };

    useEffect(() => {
        fetchUserHistory();
    }, []);

    console.log(activities);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" sx={{ mb: 2 }}>
                    <IconActivity stroke={1.5} size="1.2rem" />
                    <Typography variant="h4" fontWeight="600" sx={{ ml: 1 }}>
                        Activity
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="row" sx={{ gap: 1 }}>
                    <Button
                        size="small"
                        variant={filter === 'all' ? 'contained' : 'outlined'}
                        color={filter === 'all' ? 'secondary' : 'primary'}
                        startIcon={<IconLayoutGrid stroke={1.5} size="1.2rem" />}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        size="small"
                        variant={filter === 'listings' ? 'contained' : 'outlined'}
                        color={filter === 'listings' ? 'secondary' : 'primary'}
                        startIcon={<IconTag stroke={1.5} size="1.2rem" />}
                        onClick={() => setFilter('listings')}
                    >
                        Listings
                    </Button>
                    <Button
                        size="small"
                        variant={filter === 'purchases' ? 'contained' : 'outlined'}
                        color={filter === 'purchases' ? 'secondary' : 'primary'}
                        startIcon={<IconArchive stroke={1.5} size="1.2rem" />}
                        onClick={() => setFilter('purchases')}
                    >
                        Purchases
                    </Button>
                    <Button
                        size="small"
                        variant={filter === 'sales' ? 'contained' : 'outlined'}
                        color={filter === 'sales' ? 'secondary' : 'primary'}
                        startIcon={<IconCoin stroke={1.5} size="1.2rem" />}
                        onClick={() => setFilter('sales')}
                    >
                        Sales
                    </Button>
                    <Button
                        size="small"
                        variant={filter === 'mints' ? 'contained' : 'outlined'}
                        color={filter === 'mints' ? 'secondary' : 'primary'}
                        startIcon={<IconFingerprint stroke={1.5} size="1.2rem" />}
                        onClick={() => setFilter('mints')}
                    >
                        Mints
                    </Button>
                    <Button
                        size="small"
                        variant={filter === 'offers' ? 'contained' : 'outlined'}
                        color={filter === 'offers' ? 'secondary' : 'primary'}
                        startIcon={<IconArrowUpRight stroke={1.5} size="1.2rem" />}
                        onClick={() => setFilter('offers')}
                    >
                        Offers Made
                    </Button>
                </Box>

                <Divider sx={{ mt: 2, mb: 2 }} />

                {activities.market_place_snapshots && activities.market_place_snapshots.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="collab table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>When</TableCell>
                                    <TableCell>Marketplace</TableCell>
                                    <TableCell>Transaction</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.market_place_snapshots.map((activity: any, index: number) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            {activity.market_place_state.type === 'LISTING' &&
                                                activity.market_place_state.buyer_address === null && (
                                                    <Chip
                                                        label="Listing"
                                                        size="small"
                                                        color="warning"
                                                        icon={<IconTag size="1rem" stroke={1.4} />}
                                                        sx={{ mr: '5px', borderRadius: '4px' }}
                                                    />
                                                )}
                                            {activity.market_place_state.type === 'DELISTING' && (
                                                <Chip
                                                    label="Delisting"
                                                    size="small"
                                                    color="warning"
                                                    icon={<IconTag size="1rem" stroke={1.4} />}
                                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                                />
                                            )}
                                            {activity.market_place_state === null && (
                                                <Chip
                                                    label="Mint"
                                                    size="small"
                                                    color="info"
                                                    icon={<IconFingerprint size="1rem" stroke={1.4} />}
                                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                                />
                                            )}
                                            {activity.market_place_state.type === 'TRANSACTION' && (
                                                <Chip
                                                    label="Sale"
                                                    size="small"
                                                    color="error"
                                                    icon={<IconCoin size="1rem" stroke={1.4} />}
                                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                                />
                                            )}
                                            {activity.market_place_state.type === 'TRANSACTION' && (
                                                <Chip
                                                    label="Purchase"
                                                    size="small"
                                                    color="secondary"
                                                    icon={<IconArchive size="1rem" stroke={1.4} />}
                                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                                />
                                            )}
                                            {activity.market_place_state.type === 'BID' && (
                                                <Chip
                                                    label="Offer Made"
                                                    size="small"
                                                    color="info"
                                                    icon={<IconArrowUpRight size="1rem" stroke={1.4} />}
                                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                                />
                                            )}
                                            {activity.market_place_state.type === 'CANCELBID' && (
                                                <Chip
                                                    label="Offer Rescinded"
                                                    size="small"
                                                    color="info"
                                                    icon={<IconArrowUpRight size="1rem" stroke={1.4} />}
                                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Fade in timeout={500} unmountOnExit>
                                                    <Avatar
                                                        src={activity.meta_data_img === null ? PlaceholderImage : activity.meta_data_img}
                                                        sx={{
                                                            height: '56px',
                                                            width: '56px',
                                                            borderRadius: '8px',
                                                            backgroundColor: 'transparent'
                                                        }}
                                                        color="inherit"
                                                    />
                                                </Fade>
                                                <Stack>
                                                    <Typography variant="h5" fontWeight="700" sx={{ ml: 1 }}>
                                                        {activity.name === null ? shortenAddress(activity.token_address) : activity.name}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Stack>
                                                <Typography variant="h4">{activity.market_place_state.price} ◎</Typography>
                                                <Typography variant="body1">
                                                    {formatUSD.format(activity.market_place_state.price * solPrice)}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`Rank ${activity.rank_est}`}
                                                size="small"
                                                color="warning"
                                                icon={<StarFilled style={{ fontSize: 14 }} />}
                                                sx={{
                                                    borderRadius: 3,
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
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Chip
                                                    avatar={<Avatar>M</Avatar>}
                                                    label={
                                                        activity.market_place_state.buyer_address !== null
                                                            ? shortenAddress(activity.market_place_state.buyer_address, 5)
                                                            : shortenAddress(activity.market_place_state.seller_address, 5)
                                                    }
                                                />
                                                {/* <Avatar
                                                    // src={collab.requester.avatarURI ? collab.requester.avatarURI : DefaultUser}
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        backgroundColor: 'transparent',
                                                        cursor: 'pointer'
                                                    }}
                                                    color="inherit"
                                                >
                                                    A
                                                </Avatar>
                                                <Typography variant="h5" sx={{ ml: 1 }}>
                                                    {activity.market_place_state.buyer_address !== null
                                                        ? shortenAddress(activity.market_place_state.buyer_address, 5)
                                                        : shortenAddress(activity.market_place_state.seller_address, 5)}
                                                </Typography> */}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1">
                                                {relativeTimeFromDates(new Date(activity.market_place_state.block_timestamp * 1000))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                {activity.market_place_state.marketplace_program_id ===
                                                    '5SKmrbAxnHV2sgqyDXkGrLrokZYtWWVEEk5Soed7VLVN' && (
                                                    <>
                                                        <Tooltip title="YAWWW" placement="top" arrow>
                                                            <Avatar
                                                                src={YawwwLogo}
                                                                sx={{
                                                                    height: '24px',
                                                                    width: '24px',
                                                                    borderRadius: '100%',
                                                                    backgroundColor: 'transparent'
                                                                }}
                                                                color="inherit"
                                                            />
                                                        </Tooltip>
                                                        <Typography variant="body1" fontWeight="600" sx={{ ml: 1 }}>
                                                            YAWWW
                                                        </Typography>
                                                    </>
                                                )}
                                                {activity.market_place_state.marketplace_program_id ===
                                                    'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K' && (
                                                    <>
                                                        <Tooltip title="Magic Eden V2" placement="top" arrow>
                                                            <Avatar
                                                                src={MagicEden}
                                                                sx={{
                                                                    height: '24px',
                                                                    width: '24px',
                                                                    borderRadius: '100%',
                                                                    backgroundColor: 'transparent'
                                                                }}
                                                                color="inherit"
                                                            />
                                                        </Tooltip>
                                                        <Typography variant="body1" fontWeight="600" sx={{ ml: 1 }}>
                                                            Magic Eden V2
                                                        </Typography>
                                                    </>
                                                )}
                                                {activity.market_place_state.marketplace_program_id ===
                                                    'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk' && (
                                                    <>
                                                        <Tooltip title="Opensea" placement="top" arrow>
                                                            <Avatar
                                                                src={OpenseaLogo}
                                                                sx={{
                                                                    height: '24px',
                                                                    width: '24px',
                                                                    borderRadius: '100%',
                                                                    backgroundColor: 'transparent'
                                                                }}
                                                                color="inherit"
                                                            />
                                                        </Tooltip>
                                                        <Typography variant="body1" fontWeight="600" sx={{ ml: 1 }}>
                                                            Opensea
                                                        </Typography>
                                                    </>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip
                                                title="View on Solscan"
                                                placement="top"
                                                onClick={() => handleExplore('solscan', activity.market_place_state.signature)}
                                                arrow
                                            >
                                                <img src={SolscanLogo} alt="" width={16} height={16} style={{ cursor: 'pointer' }} />
                                            </Tooltip>
                                            <Tooltip
                                                title="View on Explorer"
                                                placement="top"
                                                onClick={() => handleExplore('explorer', activity.market_place_state.signature)}
                                                arrow
                                            >
                                                <img
                                                    src={ExplorerLogo}
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                    style={{ marginLeft: 5, cursor: 'pointer' }}
                                                />
                                            </Tooltip>
                                            <Tooltip
                                                title="View on SolanaFM"
                                                placement="top"
                                                onClick={() => handleExplore('solanafm', activity.market_place_state.signature)}
                                                arrow
                                            >
                                                <img
                                                    src={SolanaFMLogo}
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                    style={{ marginLeft: 5, cursor: 'pointer' }}
                                                />
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <CircularProgress color="secondary" />
                        </Box>
                    </Grid>
                )}

                {activities.market_place_snapshots && activities.market_place_snapshots.length === 0 && (
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
                                    No User Activity Found
                                </Typography>
                                <Typography variant="subtitle2" color="inherit">
                                    There are no user activities to display.
                                </Typography>
                            </Stack>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
};

export default AnalyticsTab;
