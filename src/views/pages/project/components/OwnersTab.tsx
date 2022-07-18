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
import { relativeTimeFromDates, abbreviateValue, shortenAddress } from 'utils/utils';
import MainCard from 'components/MainCard';

// third-party
import { HyperspaceClient } from 'hyperspace-client-js';

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

const ActivityTab = ({ project, projectSlug }: { project: any; projectSlug: any }) => {
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
                    actionTypes: ['TRANSACTION', 'BID', 'CANCELBID', 'LISTING', 'DELISTING', 'UPDATELISTING'],
                    nonMpaActionTypes: ['MINT']
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
                                    <TableCell>#</TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>Owned</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activities.market_place_snapshots.map((activity: any, index: number) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <Avatar
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
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{abbreviateValue(1250)}</TableCell>
                                        <TableCell>
                                            <Button size="medium" variant="outlined" sx={{ borderRadius: `50px`, mr: 0.5 }}>
                                                Follow User
                                            </Button>
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

export default ActivityTab;
