// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Chip } from '@mui/material';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import Logo from 'components/Logo';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import BlockchainSection from './BlockchainSection';
import LocalizationSection from './LocalizationSection';
import NotificationSection from './NotificationSection';
import Customization from './Customization';
import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
    const theme = useTheme();
    const { connected } = useWallet();

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    alignItems: 'center',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', flexGrow: 1 }}>
                    <Logo />
                </Box>
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        overflow: 'hidden',
                        transition: 'all .2s ease-in-out',
                        background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : theme.palette.secondary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                        '&:hover': {
                            background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                            color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                        }
                    }}
                    onClick={() => dispatch(openDrawer(!drawerOpen))}
                    color="inherit"
                >
                    <IconMenu2 stroke={1.5} size="1.3rem" />
                </Avatar>
            </Box>

            {/* blockchain selection */}
            {/* <BlockchainSection /> */}

            {/* header search */}
            <SearchSection />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* localization */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LocalizationSection />
            </Box>

            <BlockchainSection />

            {/* notification & profile */}
            {connected && <NotificationSection />}

            <Customization />

            {/* <Chip
                label="BETA"
                size="small"
                sx={{
                    borderRadius: '4px',
                    fontWeight: 600,
                    backgroundColor: '#d329ff',
                    backgroundImage: 'linear-gradient(147deg, #d329ff 0%, #69147f 97%)'
                }}
            /> */}

            {/* <ProfileSection /> */}

            {/* mobile header */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MobileSection />
            </Box>
        </>
    );
};

export default Header;
