/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Box, CardMedia, Grid, Tab, Tabs, Typography, IconButton, Dialog, Button, Tooltip, Divider, Chip, Badge } from '@mui/material';

// web3 imports
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';

// third-party
import { HyperspaceClient } from 'hyperspace-client-js';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import moment from 'moment';

// assets
import {
    IconBook,
    IconStar,
    IconBolt,
    IconActivity,
    IconTrophy,
    IconCopy,
    IconShare,
    IconChevronDown,
    IconChevronUp
} from '@tabler/icons';
import { CrownFilled, BugFilled, HeartFilled, ClockCircleOutlined } from '@ant-design/icons';
import PersonAddTwoToneIcon from '@mui/icons-material/PersonAddTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import SolanaLogo from 'assets/images/icons/solana-logo.png';
import CoverPhoto from 'assets/images/profile-bg.png';
import DefaultUser from 'assets/images/users/user-image.jpg';

// project imports
import { useToasts } from 'hooks/useToasts';
import { HS_API_KEY } from 'config';
import { gridSpacing } from 'store/constant';
import { TabsProps } from 'types';
import { shortenAddress, abbreviateValue, ordinal_suffix_of, formatPercent } from 'utils/utils';
import VerifiedTokens from 'utils/solana';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import UpdateAvatarModal from './modals/UpdateAvatarModal';
import Portfolio from './Portfolio';
import Nfts from './components/NftsTab';
import Badges from './components/BadgesTab';
import Activity from './components/ActivityTab';

// graphql
import { useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// function TabPanel({ children, value, ...other }: TabsProps) {
//     console.log(value);
//     return (
//         <div role="tabpanel" hidden={value !== value} {...other}>
//             {value === value && <Box sx={{ p: 0 }}>{children}</Box>}
//         </div>
//     );
// }

function a11yProps(index: number) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

const tabOptions = [
    {
        value: 'portfolio',
        icon: <IconBook stroke={1.5} size="1.1rem" />,
        label: 'Portfolio'
    },
    {
        value: 'nfts',
        icon: <IconStar stroke={1.5} size="1.1rem" />,
        label: 'NFTs'
    },
    {
        value: 'activity',
        icon: <IconActivity stroke={1.5} size="1.1rem" />,
        label: 'Activity'
    },
    {
        value: 'badges',
        icon: <IconBolt stroke={1.5} size="1.1rem" />,
        label: 'Badges'
    },
];

function UserAccount() {
    const theme = useTheme();
    const navigate = useNavigate();
    const { showInfoToast, showErrorToast, showWarningToast } = useToasts();
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { vanity } = useParams();

    const hsClient = new HyperspaceClient(HS_API_KEY);

    const { data, loading, error, refetch } = useQuery(db.queries.GET_USER, { variables: { wallet: vanity }, fetchPolicy: 'network-only' });

    const [value, setValue] = useState<string>('portfolio')
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // Styles
    const sideAvatarSX = {
        borderRadius: '8px',
        width: 48,
        height: 48,
        fontSize: '1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
        '&>svg': {
            width: 24,
            height: 24
        }
    };

    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const onFinish = () => {
        setOpen(false);
        refetch();
    };

    const [nfts, setNfts] = useState<any>(null);
    const getUserNFTs = async () => {
        const nftsList = await getParsedNftAccountsByOwner({ publicAddress: vanity!, connection });
        const list: any = [];
        for (const item of nftsList) {
            try {
                await axios.get(item.data.uri).then((res) => {
                    list.push({
                        name: res.data.name,
                        image: res.data.image
                    })
                }).catch((err) => {
                    console.log(err);
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        setNfts(list);
    };

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tokenList, setTokenList] = useState<any>([]);
    const getUserTokens = async () => {
        const verifiedTokens = Object.values(VerifiedTokens);
        const tokens: any = [];
        try {
            await axios.get(`https://public-api.solscan.io/account/tokens?account=${vanity}`).then((res) => {
                res.data.forEach((token: any) => {
                    if (!verifiedTokens.includes(token.tokenAddress)) return;
                    if (token.tokenAddress === 'BdwbTU3G23sub6wcGX1WJCM2dG8GJu8faip5QQ8BmvNc') {
                        tokens.push({
                            tokenAddress: token.tokenAddress,
                            tokenIcon: 'https://www.arweave.net/4Mp3YmQZ5mhC2d3Y1b6BZHi6FYLxWYy6SjhX5JNVob8?ext=png',
                            tokenName: 'Vaporize Finance',
                            tokenSynbol: 'VAPOR',
                            tokenAmount: token.tokenAmount
                        });
                    }

                    tokens.push({
                        tokenAddress: token.tokenAddress,
                        tokenIcon: token.tokenIcon,
                        tokenName: token.tokenName,
                        tokenSymbol: token.tokenSymbol,
                        tokenAmount: token.tokenAmount
                    });
                });
                setIsLoading(false);
                setTokenList(tokens);
            }).catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error);
        }
    }

    // wallet stats hist
    const [chartData, setChartData] = useState<any>(null);
    const [liquidValue, setLiquidValue] = useState<any>(0);
    const [rawValue, setRawValue] = useState<any>(null);
    const getUserStats = async () => {
        const value: any = [];
        const rValue: any = [];
        hsClient
            .getWalletStatsHist({
                condition: {
                    searchAddress: vanity!
                }
            })
            .then((res: any) => {
                if (res.getWalletStatsHist != null || res.getWalletStatsHist != undefined) {
                    res.getWalletStatsHist?.wallet_stats_history?.map((hist: any) => {
                        value.push({ price: Math.floor(hist.portfolio_value).toFixed(0) });
                        rValue.push({ price: hist.portfolio_value.toFixed(2) });
                    });

                    if (res.getWalletStatsHist?.wallet_stats_history?.length === 0) {
                        for (let i = 0; i < 6; i++) {
                            value.push({ price: Math.floor(1).toFixed(0) });
                        }
                    }

                    setChartData(value.reverse());
                    setRawValue(rValue.reverse());
                    setLiquidValue(rValue.length === 0 ? 0 : rValue[rValue.length - 1].price);
                }
            });
    };
    
    useEffect(() => {
        getUserNFTs();
        getUserTokens();
        getUserStats();
    }, []);

    return (
        <>
            {!loading && data.user && (
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <CardMedia
                            image={CoverPhoto}
                            sx={{
                                overflow: 'hidden',
                                height: 270,
                                ml: '-20px',
                                mr: '-20px',
                                mt: '-20px'
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ pt: '0 !important' }}>
                        <MainCard
                            sx={{
                                overflow: 'visible !important',
                                mt: '-10%'
                            }}
                            contentSX={{
                                p: 1.5,
                                paddingBottom: '0px !important',
                                [theme.breakpoints.down('lg')]: {
                                    textAlign: 'center'
                                }
                            }}
                        >
                            <Box display="flex" flexDirection="row" sx={{ mb: 2 }}>
                                {/* <EditIcon style={{ position: 'absolute', top: '-10px', left: '30px', fontSize: '46px', zIndex: 9999 }} /> */}
                                {data.user.wallet === publicKey!.toBase58() ? (
                                    <Avatar
                                        alt="User Image"
                                        src={data.user.avatarURI ? data.user.avatarURI : DefaultUser}
                                        onClick={handleOpen}
                                        sx={{
                                            mt: '-40px',
                                            boxShadow: '0px 4px 20px 5px rgba(0, 0, 0, 0.7)',
                                            '&:hover': {
                                                cursor: 'pointer',
                                                transition: 'all .15s ease-in-out',
                                                filter: 'brightness(0.4)'
                                            },
                                            width: { xs: 72, sm: 72, md: 80 },
                                            height: { xs: 72, sm: 72, md: 80 }
                                        }}
                                    />
                                ) : (
                                    <Avatar
                                        alt="User Image"
                                        src={data.user.avatarURI ? data.user.avatarURI : DefaultUser}
                                        sx={{
                                            mt: '-40px',
                                            boxShadow: '0px 4px 20px 5px rgba(0, 0, 0, 0.7)',
                                            width: { xs: 72, sm: 72, md: 80 },
                                            height: { xs: 72, sm: 72, md: 80 }
                                        }}
                                    />
                                )}
                                {/* buttons n shit */}
                                <Box display="flex" justifyContent="flex-end" sx={{ gap: 0.5, width: '100%' }}>
                                    {data.user.wallet === publicKey!.toBase58() ? (
                                        <Button size="medium" variant="outlined" sx={{ borderRadius: `50px`, mr: 0.5 }}>
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <Button size="medium" variant="outlined" sx={{ borderRadius: `50px`, mr: 0.5 }}>
                                            Follow User
                                        </Button>
                                    )}
                                    <Tooltip title="Share Profile URL" placement="bottom" arrow>
                                        <IconButton
                                            sx={{ mr: 0.5 }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`https://vaporize.fi/profile/${vanity!}`);
                                                showInfoToast('Profile link copied to clipboard.');
                                            }}
                                        >
                                            <IconShare size="1.2rem" color={theme.palette.primary.main}  />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Copy Wallet Address" placement="bottom" arrow>
                                        <IconButton onClick={() => {
                                            navigator.clipboard.writeText(vanity!);
                                            showInfoToast('Wallet address copied to clipboard.');
                                        }}>
                                            <IconCopy size="1.2rem" color={theme.palette.primary.main} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {/* vanity / bio */}
                            <Box display="flex" flexDirection="column">
                                <Typography variant="h2" sx={{ mb: 2 }}>
                                    {!loading && data.user && data.user.vanity
                                        ? data.user.vanity
                                        : shortenAddress(vanity ?? '', 7)}
                                </Typography>
                                {!loading && data.user && data.user.bio &&
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {data.user.bio}
                                    </Typography>
                                }

                                <Divider sx={{ mt: 1, mb: 1 }} />
                            </Box>

                            {/* portfolio */}
                            <Box display="flex" flexDirection="column">
                                <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                                    Portfolio Value
                                </Typography>
                                <Box display="flex" flexDirection="row" alignItems="center" sx={{ mb: 1 }}>
                                    <Avatar
                                        src={SolanaLogo}
                                        sx={{
                                            height: '24px',
                                            width: '24px',
                                            cursor: 'pointer'
                                        }}
                                        color="inherit"
                                    />
                                    <Typography variant="h4" color="inherit" sx={{ marginInline: 1 }}>
                                        {liquidValue}
                                    </Typography>
                                    {rawValue && rawValue.length !== 0 ? (
                                        <Box>
                                            {Math.sign((rawValue[6].price - rawValue[0].price) / rawValue[0].price) === 1 ? (
                                                <Chip
                                                    label={formatPercent.format(
                                                        (rawValue[6].price - rawValue[0].price) / rawValue[0].price
                                                    )}
                                                    size="small"
                                                    color="success"
                                                    icon={<IconChevronUp size="1.1rem" stroke={1.5} />}
                                                    sx={{ borderRadius: '24px' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label={formatPercent.format(
                                                        (rawValue[6].price - rawValue[0].price) / rawValue[0].price
                                                    )}
                                                    size="small"
                                                    color="error"
                                                    icon={<IconChevronDown size="1.1rem" stroke={1.5} />}
                                                    sx={{ borderRadius: '24px' }}
                                                />
                                            )}
                                        </Box>
                                    ) : (
                                        <Chip
                                            label="N/A"
                                            size="small"
                                            color="primary"
                                            icon={<IconChevronDown size="1.1rem" stroke={1.5} />}
                                            sx={{ borderRadius: '24px' }}
                                        />
                                    )}
                                    <Typography variant="h5" color="primary" fontWeight="600" sx={{ ml: 1 }}>
                                        Past week
                                    </Typography>
                                </Box>
                                <ResponsiveContainer width="100%" height={120}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#69147f" stopOpacity={0.9} />
                                                <stop offset="95%" stopColor="#d329ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="price" stroke="#d329ff" fillOpacity={1} fill="url(#colorGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                                {/* <Divider sx={{ mt: 1, mb: 1 }} /> */}
                            </Box>

                            {/* badges */}
                            {/* <Box display="flex" flexDirection="column">
                                <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                                    Badges ({data.user.badges.length} Total)
                                </Typography>
                                <Box display="flex" flexDirection="row">
                                    <Tooltip title="Staff" placement="bottom" arrow>
                                        <IconButton sx={{ mr: 0.5 }}>
                                            <CrownFilled style={{ fontSize: '24px', color: theme.palette.secondary.dark }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Bug Hunter" placement="bottom" arrow>
                                        <IconButton sx={{ mr: 0.5 }}>
                                            <BugFilled style={{ fontSize: '24px', color: theme.palette.warning.dark }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Test Badge" placement="bottom" arrow>
                                        <IconButton>
                                            <HeartFilled style={{ fontSize: '24px', color: theme.palette.info.dark }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Divider sx={{ mt: 1, mb: 1 }} />
                            </Box> */}

                            {/* connected wallets / bundles */}
                            {/* <Box display="flex" flexDirection="column" sx={{ mb: 1 }}>
                                <Box display="flex" flexDirection="row" alignItems="center" sx={{ pb: 2 }}>
                                    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6668 2.66667H11.0002V2C11.0002 1.46957 10.7894 0.960859 10.4144 0.585787C10.0393 0.210714 9.5306 0 9.00016 0H2.3335C1.80306 0 1.29436 0.210714 0.919283 0.585787C0.54421 0.960859 0.333496 1.46957 0.333496 2V10C0.333496 10.5304 0.54421 11.0391 0.919283 11.4142C1.29436 11.7893 1.80306 12 2.3335 12H11.6668C12.1973 12 12.706 11.7893 13.081 11.4142C13.4561 11.0391 13.6668 10.5304 13.6668 10V4.66667C13.6668 4.13623 13.4561 3.62753 13.081 3.25245C12.706 2.87738 12.1973 2.66667 11.6668 2.66667ZM2.3335 1.33333H9.00016C9.17697 1.33333 9.34654 1.40357 9.47157 1.5286C9.59659 1.65362 9.66683 1.82319 9.66683 2V2.66667H2.3335C2.15669 2.66667 1.98712 2.59643 1.86209 2.4714C1.73707 2.34638 1.66683 2.17681 1.66683 2C1.66683 1.82319 1.73707 1.65362 1.86209 1.5286C1.98712 1.40357 2.15669 1.33333 2.3335 1.33333ZM12.3335 8H11.6668C11.49 8 11.3204 7.92976 11.1954 7.80474C11.0704 7.67971 11.0002 7.51014 11.0002 7.33333C11.0002 7.15652 11.0704 6.98695 11.1954 6.86193C11.3204 6.73691 11.49 6.66667 11.6668 6.66667H12.3335V8ZM12.3335 5.33333H11.6668C11.1364 5.33333 10.6277 5.54405 10.2526 5.91912C9.87754 6.29419 9.66683 6.8029 9.66683 7.33333C9.66683 7.86377 9.87754 8.37247 10.2526 8.74755C10.6277 9.12262 11.1364 9.33333 11.6668 9.33333H12.3335V10C12.3335 10.1768 12.2633 10.3464 12.1382 10.4714C12.0132 10.5964 11.8436 10.6667 11.6668 10.6667H2.3335C2.15669 10.6667 1.98712 10.5964 1.86209 10.4714C1.73707 10.3464 1.66683 10.1768 1.66683 10V3.88667C1.88101 3.96201 2.10645 4.00034 2.3335 4H11.6668C11.8436 4 12.0132 4.07024 12.1382 4.19526C12.2633 4.32029 12.3335 4.48986 12.3335 4.66667V5.33333Z" fill="#465ED2"></path></svg>
                                    <Typography variant="h4" color="primary" sx={{ ml: 1 }}>
                                        Bundled Wallets
                                    </Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                    sx={{
                                        background: theme.palette.mode === 'dark' ? '#0b0f19' : theme.palette.primary.main,
                                        borderRadius: '35px',
                                        mb: 2
                                    }}
                                >
                                    <Avatar
                                        src={SolanaLogo}
                                        sx={{
                                            height: '48px',
                                            width: '48px',
                                            cursor: 'pointer'
                                        }}
                                        color="inherit"
                                    />
                                    <Typography variant="h4" color="inherit" sx={{ ml: 1 }}>
                                        matical.sol
                                    </Typography>
                                </Box>
                                <Box
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                    sx={{
                                        background: theme.palette.mode === 'dark' ? '#0b0f19' : theme.palette.primary.main,
                                        borderRadius: '35px',
                                        mb: 2
                                    }}
                                >
                                    <Avatar
                                        src={SolanaLogo}
                                        sx={{
                                            height: '48px',
                                            width: '48px',
                                            cursor: 'pointer'
                                        }}
                                        color="inherit"
                                    />
                                    <Typography variant="h4" color="inherit" sx={{ ml: 1 }}>
                                        M1NX...8dwM
                                    </Typography>
                                </Box>
                            </Box> */}
                        </MainCard>

                        {/* user stats */}
                        <MainCard sx={{ mt: 2 }}>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item>
                                    <Box
                                        sx={{
                                            ...sideAvatarSX,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main + 20 : 'primary.light',
                                            border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                                            borderColor: 'success.dark',
                                            color: 'success.dark'
                                        }}
                                    >
                                        <ClockCircleOutlined />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            mb: 0.625,
                                            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'secondary.main'
                                        }}
                                    >
                                        {moment(Number(data.user.createdAt)).format('MMMM yyyy')}
                                    </Typography>
                                    <Typography variant="body2" color="primary">
                                        Active Since
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ margin: '16px 0' }} />
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item>
                                    <Box
                                        sx={{
                                            ...sideAvatarSX,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.info.main + 20 : 'primary.light',
                                            border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                                            borderColor: 'info.main',
                                            color: 'info.dark'
                                        }}
                                    >
                                        <PeopleAltTwoToneIcon />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            mb: 0.625,
                                            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'secondary.main'
                                        }}
                                    >
                                        {data.user.socialStats ? abbreviateValue(data.user.socialStats.followersCount) : 0}
                                    </Typography>
                                    <Typography variant="body2" color="primary">
                                        Followers
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size="large">
                                        <NavigateNextRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider sx={{ margin: '16px 0' }} />
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item>
                                    <Box
                                        sx={{
                                            ...sideAvatarSX,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.secondary.main + 20 : 'secondary.light',
                                            borderColor: 'secondary.main',
                                            color: 'secondary.dark'
                                        }}
                                    >
                                        <IconActivity />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            mb: 0.625,
                                            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'secondary.main'
                                        }}
                                    >
                                        {data.user.socialStats ? abbreviateValue(data.user.socialStats.followedCount) : 0}
                                    </Typography>
                                    <Typography variant="body2" color="primary">
                                        Following
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size="large">
                                        <NavigateNextRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider sx={{ margin: '16px 0' }} />
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item>
                                    <Box
                                        sx={{
                                            ...sideAvatarSX,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.warning.main + 20 : 'primary.light',
                                            border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                                            borderColor: 'warning.main',
                                            color: 'warning.dark'
                                        }}
                                    >
                                        <IconTrophy />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            mb: 0.625,
                                            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'secondary.main'
                                        }}
                                    >
                                        {data.user.socialStats ? ordinal_suffix_of(data.user.socialStats.followersRank) : 'Unranked'}
                                    </Typography>
                                    <Typography variant="body2" color="primary">
                                        Leaderboard
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size="large" onClick={() => navigate('/ranking', { replace: true })}>
                                        <NavigateNextRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>

                    {/* right-side content */}
                    <Grid item xs={8} sx={{ pt: '20px !important' }}>
                        <TabContext value={value}>
                            <Tabs
                                value={value}
                                variant="scrollable"
                                onChange={handleChange}
                                sx={{
                                    // marginTop: 2.5,
                                    '& .MuiTabs-flexContainer': {
                                        border: 'none'
                                    },
                                    '& button': {
                                        minHeight: 'auto',
                                        minWidth: 10,
                                        py: 1.5,
                                        px: 1,
                                        mr: 2.25,
                                        color: 'primary.main',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    '& .Mui-selected': {
                                        color: 'white'
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'secondary.main'
                                    },
                                    '& button > svg': {
                                        mr: 1.25,
                                        mb: '0px !important'
                                    }
                                }}
                            >
                                {tabOptions.map((option, index) => (
                                    <Tab
                                        key={index}
                                        value={option.value}
                                        icon={option.icon}
                                        label={option.label}
                                        sx={{ mb: 0 }}
                                        {...a11yProps(index)}
                                    />
                                ))}
                            </Tabs>

                            <Divider sx={{ mb: 2 }} />

                            <TabPanel value="portfolio" sx={{ padding: 0 }}>
                                <Box sx={{ p: '0 !important' }}>
                                    <Portfolio user={data.user} tokenList={tokenList} isLoading={isLoading} />
                                </Box>
                            </TabPanel>
                            <TabPanel value="nfts" sx={{ padding: 0 }}>
                                <Box sx={{ p: '0 !important' }}>
                                    <Nfts />
                                </Box>
                            </TabPanel>
                            <TabPanel value="activity" sx={{ padding: 0 }}>
                                <Box sx={{ p: '0 !important' }}>
                                    <Activity user={data.user} />
                                </Box>
                            </TabPanel>
                            <TabPanel value="badges" sx={{ padding: 0 }}>
                                <Box sx={{ p: '0 !important' }}>
                                    <Badges user={data.user} />
                                </Box>
                            </TabPanel>
                        </TabContext>
                    </Grid>

                    {/* Dialog renders its body even if not open */}
                    <Dialog maxWidth="sm" fullWidth onClose={handleClose} open={open} scroll="paper" sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                        {open && <UpdateAvatarModal user={data.user} nfts={nfts} onCancel={handleClose} onFinish={onFinish} />}
                    </Dialog>
                </Grid>
            )}
        </>
    );
}

export default UserAccount;
