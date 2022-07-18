import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip, ClickAwayListener, Divider, Paper, Popper, Stack, Typography } from '@mui/material';

// third party
import Cookies from 'js-cookie';

// web3 imports
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// project imports
import useAuth from 'hooks/useAuth';
import { shortenAddress } from 'utils/utils';
import { displayUserAvatar } from 'utils/discord';
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import { IconCrown, IconGift, IconPower, IconRefresh, IconSettings } from '@tabler/icons';
import UserImage from 'assets/images/users/user-image.jpg';
import SolanaLogo from 'assets/images/icons/solana-logo.png';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { user } = useAuth();

    const { connection } = useConnection();
    const { publicKey, wallet, disconnect } = useWallet();
    const [balance, setBalance] = useState(0);

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<any>(null);

    const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const content = useMemo(() => {
        if (!wallet || !base58) return null;
        // eslint-disable-next-line prefer-template
        return base58.slice(0, 4) + '...' + base58.slice(-4);
    }, [wallet, base58]);

    const handleLogout = async () => {
        try {
            await disconnect()
                .then(() => {
                    Cookies.remove('auth-nonce');
                    navigate('login', { replace: true });
                })
                .catch(() => {
                    // silent catch
                });
        } catch (err) {
            console.error(err);
        }
    };

    const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);
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

    const fetchBalance = async () => {
        if (publicKey) {
            const solBalance = await connection.getBalance(publicKey, 'confirmed');
            setBalance(solBalance / LAMPORTS_PER_SOL);
        }
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
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    fontWeight: '700',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    }
                }}
                icon={
                    <Avatar
                        src={UserImage}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                label={content}
                deleteIcon={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
                onDelete={handleToggle}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
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
                                                    <Avatar
                                                        src={UserImage}
                                                        sx={{
                                                            ...theme.typography.mediumAvatar,
                                                            margin: '8px 8px 8px 8px !important',
                                                            cursor: 'pointer'
                                                        }}
                                                        aria-controls={open ? 'menu-list-grow' : undefined}
                                                        aria-haspopup="true"
                                                        color="inherit"
                                                    />
                                                    <Stack direction="column" alignItems="flex-start" justifyContent="flex-start">
                                                        <Typography variant="h4">
                                                            {publicKey && shortenAddress(publicKey?.toBase58(), 7)}
                                                        </Typography>
                                                        <Link
                                                            to={{
                                                                // pathname: '/under-construction'
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
                                                        {/* <img src={Clipboard} alt="Clip/Copy" style={{ marginLeft: 5 }} /> */}
                                                    </Typography>
                                                    {wallet && (
                                                        <Typography variant="body1" fontWeight="800" sx={{ ml: 1 }}>
                                                            {(balance || 0).toLocaleString()} ◎
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </Stack>

                                            <Divider sx={{ mt: 1, mb: 1 }} />

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

                                            {/* <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 0}>
                                                    <ListItemIcon>
                                                        <IconNotes stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Account Profile</Typography>} />
                                                </ListItemButton>
                                                {user.isDiscordLinked ? (
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                                                            handleListItemClick(event, 1, '/discord/link')
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <IconBrandDiscord stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="body2">Discord Linked</Typography>} />
                                                    </ListItemButton>
                                                ) : (
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                                                            handleListItemClick(event, 1, '/discord/link')
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <IconBrandDiscord stroke={1.5} size="1.3rem" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={<Typography variant="body2">Link Discord</Typography>} />
                                                    </ListItemButton>
                                                )}

                                                <Divider />

                                                <ListItemButton
                                                    sx={{ borderRadius: `${borderRadius}px` }}
                                                    selected={selectedIndex === 2}
                                                    onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                                                        handleListItemClick(event, 2, '/user/account-profile/profile1')
                                                    }
                                                >
                                                    <ListItemIcon>
                                                        <IconWorld stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Change Provider</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${borderRadius}px` }}
                                                    selected={selectedIndex === 3}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconPower stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Sign Out</Typography>} />
                                                </ListItemButton>
                                            </List> */}
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

export default ProfileSection;
