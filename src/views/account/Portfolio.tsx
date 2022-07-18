import React, { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, Grid, Stack, IconButton, Typography, Avatar, Chip } from '@mui/material';

// project imports
import { HS_API_KEY } from 'config';
import { gridSpacing } from 'store/constant';
import MainCard from 'components/MainCard';
import WalletToken from './WalletToken';
import WalletTokenPlaceholder from 'components/cards/Skeleton/WalletTokenPlaceholder';

// third-party
import moment from 'moment';
import { HyperspaceClient } from 'hyperspace-client-js';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// assets
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import { abbreviateValue, ordinal_suffix_of, formatPercent } from 'utils/utils';

import SolanaLogo from 'assets/images/icons/solana-logo.png';
import WalletImage from 'assets/images/icons/wallet.svg';
import NFTImage from 'assets/images/icons/nfts.svg';
import { IconSquarePlus, IconSquareMinus, IconTrophy, IconActivity, IconChevronDown, IconChevronUp } from '@tabler/icons';
import { ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

// types
interface PortfolioProps {
    user: any;
    tokenList: any;
    isLoading: boolean;
}

const Portfolio = ({ user, tokenList, isLoading }: PortfolioProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const hsClient = new HyperspaceClient(HS_API_KEY);

    const [walletOpen, setWalletOpen] = useState<boolean>(true);
    const [nftsOpen, setNftsOpen] = useState<boolean>(true);

    let tokenResult: ReactElement | ReactElement[] = <></>;
    if (tokenList && tokenList.length !== 0) {
        tokenResult = tokenList.map((token: any, index: number) => <WalletToken key={index} tokenData={token} />);
    }

    return (
        <Grid container spacing={gridSpacing}>
            {tokenList.length === 0 ? (
                <Grid item xs={12} sm={12} md={12}>
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
                                <QuestionCircleOutlined style={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h3" color="inherit">
                                No Token Balances Found
                            </Typography>
                            <Typography variant="subtitle2" color="inherit">
                                There are no balances to display.
                            </Typography>
                        </Stack>
                    </Box>
                </Grid>
            ) : (
                <Grid item xs={12} sm={12} md={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            {!walletOpen ? (
                                <MainCard
                                    content={false}
                                    divider={false}
                                    title="Wallet"
                                    titleSX={{ fontWeight: 500, fontSize: '18px' }}
                                    primary={
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: 1.5,
                                                border: '1px solid rgba(213, 217, 233, 0.2)',
                                                backgroundColor: '#09080d'
                                            }}
                                        >
                                            <Avatar
                                                src={WalletImage}
                                                alt=""
                                                variant="rounded"
                                                sx={{
                                                    width: '24px !important',
                                                    height: '24px !important',
                                                    backgroundColor: theme.palette.dark.main,
                                                    color: theme.palette.secondary.dark
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                                                <Typography variant="h4">$1,098.31</Typography>
                                                <IconButton size="small" color="inherit" onClick={() => setWalletOpen(true)}>
                                                    <IconSquarePlus fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </>
                                    }
                                />
                            ) : (
                                <MainCard
                                    contentSX={{ p: '12px !important' }}
                                    title="Wallet"
                                    primary={
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: 1.5,
                                                border: '1px solid rgba(213, 217, 233, 0.2)',
                                                backgroundColor: '#09080d'
                                            }}
                                        >
                                            <Avatar
                                                src={WalletImage}
                                                alt=""
                                                variant="rounded"
                                                sx={{
                                                    width: '24px !important',
                                                    height: '24px !important',
                                                    backgroundColor: theme.palette.dark.main,
                                                    color: theme.palette.secondary.dark
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                                                <Typography variant="h4">$1,098.31</Typography>
                                                <IconButton size="small" color="inherit" onClick={() => setWalletOpen(false)}>
                                                    <IconSquareMinus fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </>
                                    }
                                >
                                    {/* {isLoading ? <WalletTokenPlaceholder /> : <WalletToken isSolana />} */}
                                    {isLoading ? [1, 2, 3].map((item) => <WalletTokenPlaceholder />) : tokenResult}
                                </MainCard>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            {!nftsOpen ? (
                                <MainCard
                                    content={false}
                                    divider={false}
                                    title="NFTs"
                                    primary={
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: 1.5,
                                                border: '1px solid rgba(213, 217, 233, 0.2)',
                                                backgroundColor: '#09080d'
                                            }}
                                        >
                                            <Avatar
                                                src={NFTImage}
                                                alt=""
                                                variant="rounded"
                                                sx={{
                                                    width: '24px !important',
                                                    height: '24px !important',
                                                    backgroundColor: theme.palette.dark.main,
                                                    color: theme.palette.secondary.dark
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                                                <Typography variant="h4">$54.00</Typography>
                                                <IconButton size="small" color="inherit" onClick={() => setNftsOpen(true)}>
                                                    <IconSquarePlus fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </>
                                    }
                                />
                            ) : (
                                <MainCard
                                    title="NFTs"
                                    primary={
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            sx={{
                                                borderRadius: '9999px',
                                                padding: 1.5,
                                                border: '1px solid rgba(213, 217, 233, 0.2)',
                                                backgroundColor: '#09080d'
                                            }}
                                        >
                                            <Avatar
                                                src={NFTImage}
                                                alt=""
                                                variant="rounded"
                                                sx={{
                                                    width: '24px !important',
                                                    height: '24px !important',
                                                    backgroundColor: theme.palette.dark.main,
                                                    color: theme.palette.secondary.dark
                                                }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 1 }}>
                                                <Typography variant="h4">$54.00</Typography>
                                                <IconButton size="small" color="inherit" onClick={() => setNftsOpen(false)}>
                                                    <IconSquareMinus fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </>
                                    }
                                >
                                    <h1>hi</h1>
                                </MainCard>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default Portfolio;
