import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Grid,
    Stack,
    List,
    ListItemIcon,
    ListItemText,
    TextField,
    MenuItem,
    Avatar,
    Button,
    Typography,
    Checkbox
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

// web3
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { getStateByKey, getRaffleState } from 'actions/raffle';
import { useMeta } from 'contexts/meta/meta';
import { useToasts } from 'hooks/useToasts';
import { getNftMetaData } from 'actions/shared';
import { DECIMALS } from 'config';
import MainCard from 'components/MainCard';

// third-party
import axios from 'axios';
import moment from 'moment';

// assets
import { CheckCircleOutlined } from '@ant-design/icons';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const tokens = [
    {
        value: 'cosmic',
        label: 'COSMIC'
    },
    {
        value: 'dust',
        label: 'DUST'
    },
    {
        value: 'test',
        label: 'TEST'
    }
];

const RaffleCreate = () => {
    const theme = useTheme();
    const wallet = useWallet();
    const navigate = useNavigate();
    const { raffleKey } = useParams();
    const { showErrorToast } = useToasts();
    const { startLoading, stopLoading } = useMeta();

    const [checked, setChecked] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [valueBasic, setValueBasic] = useState<Date | null>(new Date());

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

    // creation
    const handleCreate = () => {
        if (!checked) {
            showErrorToast('You must accept the terms and conditions.');
            return;
        }

        setIsCreating(true);

        console.log('pass', checked);
    };

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '3rem', pr: 3, pl: 3 }}>
                    CREATE NEW RAFFLE
                </Typography>
            </Grid>

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
                            <Typography fontWeight="700" color="inherit" sx={{ fontSize: '2.25rem', pb: '4px' }}>
                                {name}
                            </Typography>
                        </Stack>
                    </Box>
                    {/* tabs */}
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, gap: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                label="Raffle End Date"
                                value={valueBasic}
                                onChange={(newValue: Date | null) => {
                                    setValueBasic(newValue);
                                }}
                            />
                        </LocalizationProvider>
                        <TextField
                            type="number"
                            label="Ticket Supply"
                            InputProps={{ inputProps: { min: 0, max: maxEntrants - count } }}
                            rows={1}
                            fullWidth
                            onChange={(e: any) => setTickets(e.target.value)}
                        />
                        <Box display="flex" flexDirection="row">
                            <TextField
                                type="number"
                                label="Ticket Price"
                                InputProps={{ inputProps: { min: 0, max: maxEntrants - count } }}
                                fullWidth
                                rows={1}
                                onChange={(e: any) => setTickets(e.target.value)}
                            >
                                {tokens.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="standard-select-type"
                                select
                                fullWidth
                                rows={1}
                                onChange={(e: any) => setTickets(e.target.value)}
                            >
                                {tokens.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Stack>

                    {/* <Box display="flex" alignItems="center" sx={{ pt: 1, pb: 1 }}> */}
                    <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center">
                            <Checkbox
                                color="secondary"
                                name="checked"
                                checked={checked}
                                onChange={(e) => setChecked(e.target.checked)}
                                sx={{ color: theme.palette.secondary.main }}
                            />
                            <Typography fontWeight="700" color="inherit" sx={{ fontSize: '.875rem' }}>
                                I have read and accept the terms and conditions.
                            </Typography>
                        </Box>
                        <Box>
                            <LoadingButton
                                onClick={handleCreate}
                                variant="contained"
                                size="large"
                                color="secondary"
                                sx={{ borderRadius: 3 }}
                                loading={isCreating}
                                fullWidth
                            >
                                Create Raffle
                            </LoadingButton>
                        </Box>
                    </Stack>

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

export default RaffleCreate;
