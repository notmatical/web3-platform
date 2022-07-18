import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { Box, Grid, Stack, Divider, List, ListItemIcon, ListItemText, TextField, Avatar, Button, Typography, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// web3
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { getStateByKey, getRaffleState } from 'actions/raffle';
import { useMeta } from 'contexts/meta/meta';
import { getNftMetaData } from 'actions/shared';
import { DECIMALS } from 'config';
import MainCard from 'components/MainCard';

// third-party
import axios from 'axios';
import moment from 'moment';

// assets
import { CheckCircleOutlined } from '@ant-design/icons';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SolscanLogo from 'assets/images/icons/solscan.png';
import ExplorerLogo from 'assets/images/icons/explorer.png';

const RafflePage = () => {
    const theme = useTheme();
    const wallet = useWallet();
    const navigate = useNavigate();
    const { raffleKey } = useParams();
    const { startLoading, stopLoading } = useMeta();

    const [tab, setTab] = useState('details');

    const [mint, setMint] = useState('');
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [family, setFamily] = useState('Not Specified');
    const [myTickets, setMyTickets] = useState<any>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    const [price, setPrice] = useState(0);
    const [payType, setPayType] = useState('SOL');
    const [endsAt, setEndsAt] = useState(0);
    const [count, setCount] = useState(0);
    const [maxEntrants, setMaxEntrants] = useState(0);

    const [tickets, setTickets] = useState(1);

    const [isRevealed, setIsRevealed] = useState(false);
    const [isWinner, setIsWinner] = useState(false);
    const [isClaimed, setIsClaimed] = useState(false);
    const [isTicketsView, setIsTicketsView] = useState(false);
    const [loading, setLoading] = useState(false);

    const getRaffleData = async () => {
        if (raffleKey === undefined) return;

        try {
            const raffle = await getStateByKey(new PublicKey(raffleKey));
            if (raffle !== null) {
                getNftDetail(raffle.nftMint.toBase58());
                setMint(raffle.nftMint.toBase58());
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getNftDetail = async (nftMint: string) => {
        if (raffleKey === undefined) return;

        startLoading();

        const uri = await getNftMetaData(new PublicKey(nftMint));
        await axios
            .get(uri)
            .then((res) => {
                setImage(res.data.image);
                setName(res.data.name);
                setFamily(res.data.collection.name);
            })
            .catch((error) => {
                console.log(error);
            });

        const raffleData = await getRaffleState(new PublicKey(nftMint));
        if (raffleData === null) return;

        // Assigning Variables
        const currentTickets = raffleData.count.toNumber();
        setCount(currentTickets);
        const maxTickets = raffleData.maxEntrants.toNumber();
        setMaxEntrants(maxTickets);
        const end = raffleData.endTimestamp.toNumber() * 1000;
        setEndsAt(end);

        if (raffleData.ticketPricePrey.toNumber() === 0) {
            setPrice(raffleData.ticketPriceSol.toNumber() / LAMPORTS_PER_SOL);
            setPayType('SOL');
        } else if (raffleData.ticketPriceSol.toNumber() === 0) {
            setPrice(raffleData.ticketPricePrey.toNumber() / DECIMALS);
            setPayType('COSMIC');
        }

        const mine: any = [];
        for (let i = 0; i < tickets; i += 1) {
            if (raffleData.entrants[i].toBase58() === wallet.publicKey?.toBase58()) {
                mine.push({ index: i + 1 });
            }
        }
        setMyTickets(mine);

        if (raffleData.winner[0].toBase58() === '11111111111111111111111111111111') {
            setIsRevealed(false);
        } else setIsRevealed(true);

        stopLoading();
    };

    useEffect(() => {
        if (raffleKey !== undefined) getRaffleData();
    }, [wallet.connected]);

    // Helper Functions
    const handleExplore = (site: string) => {
        switch (site) {
            case 'solscan':
                window.open(`https://solscan.io/token/${mint}`, '_blank');
                break;
            case 'explorer':
                window.open(`https://explorer.solana.com/address/${mint}`, '_blank');
                break;
            default:
                window.open(`https://solscan.io/token/${mint}`, '_blank');
                break;
        }
    };

    return (
        <Grid container>
            <Grid item sx={{ mr: 3, ml: 3 }}>
                <Avatar
                    alt="User 1"
                    src={image}
                    sx={{
                        borderRadius: '16px',
                        mb: 3,
                        width: 400,
                        height: 400
                    }}
                />
                {!wallet.connected && (
                    <Button variant="outlined" color="secondary" sx={{ borderRadius: 3 }} fullWidth>
                        Connect Wallet
                    </Button>
                )}
                <Box display="flex" justifyContent="space-between">
                    <Grid container columnSpacing={2}>
                        <Grid item xs={5}>
                            <TextField
                                type="number"
                                InputProps={{ inputProps: { min: 0, max: maxEntrants - count } }}
                                fullWidth
                                rows={1}
                                onChange={(e: any) => setTickets(e.target.value)}
                                placeholder="Quanity"
                            />
                        </Grid>

                        <Grid item xs={7}>
                            <Stack alignItems="center">
                                <Button variant="contained" color="secondary" sx={{ borderRadius: 3 }} fullWidth>
                                    Purchase Ticket
                                </Button>

                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pt: '4px' }}>
                                    {price} {payType} / Ticket
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            <Grid item xs={8}>
                <MainCard border={false} boxShadow sx={{ borderRadius: 3 }}>
                    {/* collection information */}
                    <Box display="flex" justifyContent="space-between">
                        <Stack>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                {family} <CheckCircleOutlined />
                            </Typography>
                            <Typography fontWeight="700" color="inherit" sx={{ fontSize: '2.25rem', pb: '4px' }}>
                                {name}
                                <Tooltip title="View on Solscan" placement="top" onClick={() => handleExplore('solscan')} arrow>
                                    <img src={SolscanLogo} alt="" width={24} height={24} style={{ marginLeft: 12 }} />
                                </Tooltip>
                                <Tooltip title="View on Explorer" placement="top" onClick={() => handleExplore('explorer')} arrow>
                                    <img src={ExplorerLogo} alt="" width={24} height={24} style={{ marginLeft: 6 }} />
                                </Tooltip>
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography
                                fontWeight="700"
                                color="secondary.dark"
                                onClick={() => navigate('/raffles', { replace: true })}
                                sx={{
                                    fontSize: '.875rem',
                                    pb: '4px',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        color: '#ef4444',
                                        transition: 'all .1s ease-in-out'
                                    }
                                }}
                            >
                                Back
                            </Typography>
                        </Stack>
                    </Box>

                    {/* tabs */}
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box>
                            <Button
                                variant={tab === 'details' ? 'contained' : 'text'}
                                color={tab === 'details' ? 'secondary' : 'primary'}
                                size="large"
                                sx={{ borderRadius: 2 }}
                                onClick={() => setTab('details')}
                            >
                                Details
                            </Button>
                            <Button
                                variant={tab === 'participants' ? 'contained' : 'text'}
                                color={tab === 'participants' ? 'secondary' : 'primary'}
                                size="large"
                                sx={{ borderRadius: 2 }}
                                onClick={() => setTab('participants')}
                            >
                                Participants
                            </Button>
                            <Button
                                variant={tab === 'transactions' ? 'contained' : 'text'}
                                color={tab === 'transactions' ? 'secondary' : 'primary'}
                                size="large"
                                sx={{ borderRadius: 2 }}
                                onClick={() => setTab('transactions')}
                            >
                                Transactions
                            </Button>
                        </Box>
                        <Box>
                            <Button variant="text" color="secondary" sx={{ borderRadius: 2 }}>
                                Report
                            </Button>
                        </Box>
                    </Stack>

                    <Divider />

                    {tab === 'details' && (
                        <Box display="flex" flexDirection="column" sx={{ pt: 1, pb: 1 }}>
                            {/* raffle end countdown */}
                            <Grid container>
                                {moment() > moment(endsAt) ? (
                                    <>
                                        <Grid item xs={6}>
                                            <Stack>
                                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                                    Raffle Ended On:
                                                </Typography>
                                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                                    {moment(endsAt).format('MMMM DD, yyyy')}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Stack>
                                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                                    Ticket Cost:
                                                </Typography>
                                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                                    {price} {payType}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={6}>
                                            <Stack>
                                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                                    Raffle Ends In:
                                                </Typography>
                                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                                    {moment(endsAt).format('MMMM DD, yyyy')}
                                                </Typography>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Stack>
                                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                                    Ticket Cost:
                                                </Typography>
                                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                                    {price} {payType}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </>
                                )}
                            </Grid>

                            <Grid container sx={{ mt: 3 }}>
                                {/* start date */}
                                <Grid item xs={6}>
                                    <Stack>
                                        <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                            Raffle Creation Date:
                                        </Typography>
                                        <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                            test
                                        </Typography>
                                    </Stack>
                                </Grid>

                                <Grid item xs={6}>
                                    {/* ticket remaining */}
                                    <Stack>
                                        {moment() > moment(endsAt) ? (
                                            <>
                                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                                    Tickets Sold:
                                                </Typography>
                                                <Typography fontWeight="700" color="info.dark" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                                    {count} / {maxEntrants}
                                                </Typography>
                                            </>
                                        ) : (
                                            <>
                                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                                    Tickets Remaining:
                                                </Typography>
                                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                                    {maxEntrants - count} / {maxEntrants}
                                                </Typography>
                                            </>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Grid container sx={{ mt: 3 }}>
                                <Grid item xs={6}>
                                    {/* raffler */}
                                    <Stack>
                                        <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                            Raffle Creator:
                                        </Typography>
                                        <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                            matical.sol
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {tab === 'participants' && (
                        <Box display="flex" sx={{ pt: 1, pb: 1 }}>
                            <Stack sx={{ mr: 3 }}>
                                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                    Raffle Ends In:
                                </Typography>
                                <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                    test
                                </Typography>
                            </Stack>
                        </Box>
                    )}

                    <Divider />

                    {/* terms and conditions */}
                    <MainCard
                        sx={{
                            mt: 2,
                            borderRadius: 4,
                            border: `2px solid ${theme.palette.secondary.dark} !important`,
                            backgroundColor: 'rgba(215, 0, 39, 0.05)'
                        }}
                    >
                        <Typography fontWeight="700" variant="h4" color="secondary.dark">
                            Terms & Conditions
                        </Typography>
                        <List component="div" disablePadding>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <ListItemIcon sx={{ minWidth: '15px' }}>
                                    <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                                </ListItemIcon>
                                <ListItemText primary="Nested List" />
                            </Box>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <ListItemIcon sx={{ minWidth: '15px' }}>
                                    <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                                </ListItemIcon>
                                <ListItemText primary="Nested List" />
                            </Box>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <ListItemIcon sx={{ minWidth: '15px' }}>
                                    <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                                </ListItemIcon>
                                <ListItemText primary="Nested List" />
                            </Box>
                            <Box display="flex" flexDirection="row" alignItems="center">
                                <ListItemIcon sx={{ minWidth: '15px' }}>
                                    <FiberManualRecordIcon sx={{ fontSize: '0.5rem' }} />
                                </ListItemIcon>
                                <ListItemText primary="Nested List" />
                            </Box>
                        </List>
                    </MainCard>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default RafflePage;
