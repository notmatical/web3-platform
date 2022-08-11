import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Grid,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    CircularProgress,
    Stack,
    Button,
    Typography,
    useMediaQuery
} from '@mui/material';

// project imports
import useConfig from 'hooks/useConfig';

// assets
import { IconX } from '@tabler/icons';
import SwitchIcon from 'assets/images/icons/switch-icon.svg';
import SolanaChain from 'assets/images/blockchains/solana-icon.png';
import EtherChain from 'assets/images/blockchains/ethereum-icon.png';
import PolyChain from 'assets/images/blockchains/polygon-icon.png';
import AvaxChain from 'assets/images/blockchains/avalanche-icon.png';
import NearChain from 'assets/images/blockchains/near-icon.jpg';
import CeloChain from 'assets/images/blockchains/celo-icon.png';
import CronosChain from 'assets/images/blockchains/cronos-icon.png';
import BinanceChain from 'assets/images/blockchains/binance-smart-chain-icon.png';
import EvmosChain from 'assets/images/blockchains/evmos-icon.png';

// ==============================|| LOCALIZATION ||============================== //

const BlockchainSection = () => {
    const { borderRadius, locale, onChangeLocale } = useConfig();

    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

    // Modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    [theme.breakpoints.down('md')]: {
                        ml: 1
                    }
                }}
            >
                <Avatar
                    variant="rounded"
                    sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.mediumAvatar,
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                        color: theme.palette.primary.dark,
                        transition: 'all .2s ease-in-out',
                        overflow: 'none !important',
                        '&[aria-controls="menu-list-grow"],&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: theme.palette.primary.main,
                            color: theme.palette.primary.light
                        }
                    }}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleOpen}
                    color="inherit"
                >
                    <Avatar
                        src={SolanaChain}
                        sx={{
                            borderRadius: '9999px',
                            height: '25px',
                            width: '25px',
                            backgroundColor: 'transparent'
                        }}
                        color="inherit"
                    />
                    <Box
                        display="flex"
                        sx={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            padding: '2px',
                            borderRadius: '4px',
                            backgroundColor: theme.palette.dark.main
                        }}
                    >
                        <img src={SwitchIcon} alt="Clip/Copy" style={{ color: theme.palette.primary.main, fontSize: '7px' }} />
                    </Box>
                </Avatar>
            </Box>

            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleClose} open={open} scroll="paper" sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {open && <ChooseBlockchainModal onCancel={handleClose} />}
            </Dialog>
        </>
    );
};

const ChooseBlockchainModal = ({ onCancel }: { onCancel: () => void }) => {
    const theme = useTheme();

    return (
        <>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Select Network
                <IconButton
                    aria-label="cloe"
                    onClick={onCancel}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 12,
                        color: theme.palette.grey[500]
                    }}
                >
                    <IconX />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Box display="flex" flexDirection="column" sx={{ gap: 1 }}>
                    <Box display="flex" flexDirection="row" justifyContent="flex-start" sx={{ gap: 1 }}>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={SolanaChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                Solana
                            </Typography>
                        </Button>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={EtherChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                Ethereum
                            </Typography>
                        </Button>
                    </Box>
                    {/* row 2 */}
                    <Box display="flex" flexDirection="row" justifyContent="flex-start" sx={{ gap: 1 }}>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={NearChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                NEAR
                            </Typography>
                        </Button>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={PolyChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                Polygon
                            </Typography>
                        </Button>
                    </Box>
                    {/* row 3 */}
                    <Box display="flex" flexDirection="row" justifyContent="flex-start" sx={{ gap: 1 }}>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={CeloChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                Celo
                            </Typography>
                        </Button>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={CronosChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                Cronos
                            </Typography>
                        </Button>
                    </Box>
                    {/* row 4 */}
                    <Box display="flex" flexDirection="row" justifyContent="flex-start" sx={{ gap: 1 }}>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={BinanceChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                BSC
                            </Typography>
                        </Button>
                        <Button variant="text" color="primary" fullWidth>
                            <Avatar
                                src={EvmosChain}
                                sx={{
                                    boxShadow: '0 0 0 2px #2c3a43',
                                    borderRadius: '9999px',
                                    height: '25px',
                                    width: '25px',
                                    backgroundColor: 'transparent',
                                    mr: '12px'
                                }}
                                color="inherit"
                            />
                            <Typography variant="subtitle1" fontSize="16px" fontWeight="500" color="white">
                                Evmos
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </>
    );
};

export default BlockchainSection;
