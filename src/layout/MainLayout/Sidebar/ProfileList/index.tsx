import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Stack,
    Paper,
    Skeleton,
    Badge,
    Popper,
    Button,
    Typography,
    Avatar,
    LinearProgress,
    ClickAwayListener,
    Divider
} from '@mui/material';

// web3 imports
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// project imports
import { shortenAddress } from 'utils/utils';
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/@extended/Transitions';

// graphql
import { useQuery } from '@apollo/client';
import { queries } from '../../../../graphql/graphql';

// assets
import DefaultUser from 'assets/images/users/user-image.jpg';
import { IconBook, IconGift, IconCrown, IconPower, IconRefresh, IconChevronDown } from '@tabler/icons';
import SolanaLogo from 'assets/images/icons/solana-logo.png';

// ==============================|| SIDEBAR PROFILE ||============================== //

const ProfileList = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { connection } = useConnection();
    const { publicKey, wallet, disconnect } = useWallet();
    const [balance, setBalance] = useState(0);

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<any>(null);

    const { data, loading, error } = useQuery(queries.GET_USER, { variables: { wallet: publicKey }, fetchPolicy: 'network-only' });

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (!wallet || !base58) return null;
        // eslint-disable-next-line prefer-template
        return base58.slice(0, 7) + '...' + base58.slice(-7);
    }, [wallet, base58]);

    const handleLogout = async () => {
        try {
            await disconnect()
                .then(() => {
                    navigate('login', { replace: true });
                })
                .catch(() => {});
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBalance = async () => {
        if (publicKey) {
            const solBalance = await connection.getBalance(publicKey, 'confirmed');
            setBalance(solBalance / LAMPORTS_PER_SOL);
        }
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        fetchBalance();

        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open, fetchBalance]);

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                ref={anchorRef}
                sx={{
                    textOverflow: 'ellipsis',
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : theme.palette.primary.light
                }}
            >
                <Box display="flex" flexDirection="row" alignItems="center" sx={{ p: 1, flexGrow: 1 }}>
                    {loading || !data ? (
                        <Skeleton variant="circular" animation="wave" width={44} height={44} sx={{ mr: 1 }} />
                    ) : (
                        <Avatar
                            src={data.user.avatarURI ? data.user.avatarURI : DefaultUser}
                            onClick={() => navigate(`/account/${publicKey}/portfolio`)}
                            sx={{
                                ...theme.typography.largeAvatar,
                                mr: 1,
                                cursor: 'pointer'
                            }}
                            color="inherit"
                        />
                    )}
                    <Stack justifyContent="center" sx={{ flexGrow: 1 }}>
                        <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ textOverflow: 'ellipsis' }}
                        >
                            {loading || !data ? (
                                <>
                                    <Skeleton variant="text" animation="wave" height={18} width={75} />
                                    <IconChevronDown size="1rem" />
                                </>
                            ) : (
                                <>
                                    <Typography noWrap variant="h5" fontWeight="800" sx={{ maxWidth: 140 }}>
                                        {data.user.vanity ? data.user.vanity : content}
                                    </Typography>
                                    <IconChevronDown size="1rem" onClick={handleToggle} />
                                </>
                            )}
                        </Box>
                        {loading || !data ? (
                            <LinearProgress color="secondary" sx={{ mt: 0.5, mb: 0.5 }} />
                        ) : (
                            <LinearProgress
                                variant="determinate"
                                value={(data.user.xp / data.user.levelUpXpRequired) * 100}
                                color="secondary"
                                sx={{ mt: 0.5, mb: 0.5 }}
                            />
                        )}
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            {loading || !data ? (
                                <>
                                    <Skeleton variant="text" animation="wave" height={18} width={25} />
                                    <Skeleton variant="text" animation="wave" height={18} width={60} />
                                </>
                            ) : (
                                <>
                                    <Typography variant="subtitle2">Lv. {data.user.level}</Typography>
                                    <Typography variant="subtitle2">
                                        {data.user.xp} / {data.user.levelUpXpRequired}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Box>

            <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ mt: 1, gap: 2 }}>
                <Badge color="secondary" variant="dot" sx={{ maxWidth: 'max-content' }}>
                    <Button
                        color="primary"
                        size="small"
                        variant="contained"
                        startIcon={<IconBook size="0.875rem" />}
                        sx={{ ml: 1, fontSize: '12px' }}
                        onClick={() => navigate('/quests', { replace: true })}
                        fullWidth
                    >
                        Quests
                    </Button>
                </Badge>
                <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    startIcon={<IconGift size="0.875rem" />}
                    sx={{ mr: 1, fontSize: '12px' }}
                    onClick={() => navigate('/rewards', { replace: true })}
                    fullWidth
                >
                    Rewards
                </Button>
            </Box>

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                style={{ zIndex: 9999 }}
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ m: 1 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-start">
                                                    {loading || !data ? (
                                                        <Skeleton variant="circular" animation="wave" width={44} height={44} />
                                                    ) : (
                                                        <Avatar
                                                            src={data.user.avatarURI ? data.user.avatarURI : DefaultUser}
                                                            sx={{
                                                                ...theme.typography.mediumAvatar,
                                                                margin: '8px 8px 8px 8px !important',
                                                                cursor: 'pointer'
                                                            }}
                                                            aria-controls={open ? 'menu-list-grow' : undefined}
                                                            aria-haspopup="true"
                                                            color="inherit"
                                                        />
                                                    )}
                                                    <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                        {loading || !data ? (
                                                            <>
                                                                <Skeleton variant="text" animation="wave" height={18} width={75} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Typography variant="h4">
                                                                    {data.user.vanity ? data.user.vanity : content}
                                                                </Typography>
                                                                <Link
                                                                    to={{
                                                                        pathname: `/account/${publicKey}/portfolio`
                                                                    }}
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="secondary"
                                                                        sx={{
                                                                            '&:hover': {
                                                                                transition: 'all .1s ease-in-out',
                                                                                color: theme.palette.secondary.dark
                                                                            }
                                                                        }}
                                                                    >
                                                                        View Profile
                                                                    </Typography>
                                                                </Link>
                                                            </>
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <Divider sx={{ mt: 0.5 }} />
                                        </Box>
                                        <Box
                                            sx={{
                                                p: 2,
                                                pt: 0,
                                                width: '100%',
                                                maxWidth: 350,
                                                minWidth: 300,
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                }
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                justifyContent="flex-start"
                                                sx={{ p: 0.5 }}
                                            >
                                                <Avatar
                                                    src={SolanaLogo}
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        cursor: 'pointer'
                                                    }}
                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                    aria-haspopup="true"
                                                    color="inherit"
                                                />
                                                <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                    <Typography variant="body1" fontWeight="400" sx={{ ml: 1 }}>
                                                        Main Wallet
                                                    </Typography>
                                                    {wallet && (
                                                        <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                                                            {(balance || 0).toLocaleString()} ◎
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </Stack>

                                            <Divider sx={{ mt: 1, mb: 1 }} />

                                            {data && data.user.isStaff && (
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    alignItems="center"
                                                    justifyContent="flex-start"
                                                    sx={{
                                                        p: 0.5,
                                                        mb: 1,
                                                        borderRadius: '4px',
                                                        '&:hover': {
                                                            cursor: 'pointer',
                                                            transition: 'all .1s ease-in-out',
                                                            background: theme.palette.primary.dark
                                                        }
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            ...theme.typography.mediumAvatar,
                                                            cursor: 'pointer'
                                                        }}
                                                        aria-controls={open ? 'menu-list-grow' : undefined}
                                                        aria-haspopup="true"
                                                        color="inherit"
                                                    >
                                                        <IconCrown stroke={1.5} size="1.3rem" />
                                                    </Avatar>
                                                    <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                        <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                                                            Admin Panel
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            )}

                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                justifyContent="flex-start"
                                                sx={{
                                                    p: 0.5,
                                                    mb: 1,
                                                    borderRadius: '4px',
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                        transition: 'all .1s ease-in-out',
                                                        background: theme.palette.primary.dark
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        cursor: 'pointer'
                                                    }}
                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                    aria-haspopup="true"
                                                    color="inherit"
                                                >
                                                    <IconGift stroke={1.5} size="1.3rem" />
                                                </Avatar>
                                                <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                    <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                                                        Rewards
                                                    </Typography>
                                                </Stack>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                justifyContent="flex-start"
                                                sx={{
                                                    p: 0.5,
                                                    mb: 1,
                                                    borderRadius: '4px',
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                        transition: 'all .1s ease-in-out',
                                                        background: theme.palette.primary.dark
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        cursor: 'pointer'
                                                    }}
                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                    aria-haspopup="true"
                                                    color="inherit"
                                                >
                                                    <IconRefresh stroke={1.5} size="1.3rem" />
                                                </Avatar>
                                                <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                    <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                                                        Change Provider
                                                    </Typography>
                                                </Stack>
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                alignItems="center"
                                                justifyContent="flex-start"
                                                onClick={handleLogout}
                                                sx={{
                                                    p: 0.5,
                                                    mb: 1,
                                                    borderRadius: '4px',
                                                    '&:hover': {
                                                        cursor: 'pointer',
                                                        transition: 'all .1s ease-in-out',
                                                        background: theme.palette.primary.dark
                                                    }
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        ...theme.typography.mediumAvatar,
                                                        cursor: 'pointer'
                                                    }}
                                                    aria-controls={open ? 'menu-list-grow' : undefined}
                                                    aria-haspopup="true"
                                                    color="inherit"
                                                >
                                                    <IconPower stroke={1.5} size="1.3rem" />
                                                </Avatar>
                                                <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                    <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                                                        Sign Out
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default memo(ProfileList);
