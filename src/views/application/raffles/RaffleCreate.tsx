import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Grid,
    Stack,
    TextField,
    Button,
    Typography,
    Checkbox,
    Container,
    CardMedia,
    CardContent,
    Radio,
    FormControlLabel,
    RadioGroup,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import Image from 'mui-image';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

// web3
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { useMeta } from 'contexts/meta/meta';
import MainCard from 'components/MainCard';
import { useToasts } from 'hooks/useToasts';

// third-party

// assets
import { getNFTDetail } from './fetchData';
import Loading from 'components/Loading';
import { FormattedMessage } from 'react-intl';
import { NFTDetail } from 'types/raffles';
import { DEFAULT_PAY_TYPE, RAFFLE_REWARD_TYPES, TICKETS_MAX, TOKEN_PAY_TYPE, WHITELIST_MAX } from 'config/config';
import { adminValidation } from 'actions/shared';
import { NumberInput } from 'components/NumberInput';
import { PublicKey } from '@solana/web3.js';
import { createRaffle } from 'actions/raffle';
import { TermsAndConditions } from './TermsAndConditions';

const RaffleCreate = () => {
    const theme = useTheme();
    const wallet = useWallet();
    const navigate = useNavigate();
    const { mint: mintAddr = '' } = useParams();
    const { showErrorToast } = useToasts();
    const { startLoading, stopLoading } = useMeta();

    const [checked, setChecked] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [mint, setMint] = useState('');
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [family, setFamily] = useState('Not Specified');
    const [rewardPrice, setRewardPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('sol');
    const [rewardType, setRewardType] = useState('nft');
    const [isAdmin, setIsAdmin] = useState(false);

    const [winnerCount, setWinnerCount] = useState(1);
    const [price, setPrice] = useState(0);
    const [maxTickets, setMaxTickets] = useState(TICKETS_MAX);
    const [endTime, setEndTime] = useState<Date | null>(new Date());
    const [isCreator, setIsCreator] = useState(false);

    // creation

    const handleCreate = async () => {
        if (mint === undefined) return;
        if (checkValidate()) {
            let solPrice;
            let splPrice;
            if (paymentMethod === 'sol') {
                solPrice = price;
                splPrice = 0;
            } else if (paymentMethod === 'spl') {
                solPrice = 0;
                splPrice = price;
            }
            if (solPrice === undefined) return;
            if (splPrice === undefined) return;
            if (maxTickets === undefined) return;

            const white = RAFFLE_REWARD_TYPES[rewardType];
            const winnerCnt = rewardType === 'nft' ? 1 : winnerCount;

            try {
                startLoading();
                if (endTime !== null) {
                    setIsCreating(true);
                    await createRaffle(
                        wallet,
                        new PublicKey(mint),
                        solPrice,
                        splPrice,
                        endTime.getTime() / 1000,
                        rewardPrice,
                        winnerCnt,
                        white,
                        maxTickets
                    );
                    setIsCreating(false);
                    navigate('/raffles', { replace: true });
                }
            } catch (error) {
                console.error(error);
            } finally {
                stopLoading();
            }
        }
    };

    const checkValidate = () => {
        if (price === 0) {
            showErrorToast('Please enter correct price');
            return false;
        }
        const now = new Date();
        if (endTime === null || now >= endTime) {
            showErrorToast('Please enter correct end date');
            return false;
        }
        if (rewardType === 'whitelist' && (winnerCount === undefined || winnerCount === 0)) {
            showErrorToast('Please enter the correct number of winners.');
            return false;
        }
        if (maxTickets === undefined || maxTickets === 0) {
            showErrorToast('Please enter the correct number of max tickets.');
            return false;
        }
        return true;
    };

    const handlePayment = (event: SelectChangeEvent<string>) => {
        const {
            target: { value }
        } = event;
        setPaymentMethod(value);
    };

    const handleRewardType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRewardType((event.target as HTMLInputElement).value);
    };
    const updatePage = async () => {
        setMint(mintAddr);
        try {
            startLoading();
            const item: NFTDetail = await getNFTDetail({ wallet, mint: mintAddr });
            if (item) {
                setImage(item.image);
                setName(item.name);
                setFamily(item.family);
                setDescription(item.description);
                if (item.raffleData) {
                    const { maxTickets: max, end, price: rafflePrice, payType: rafflePayType, winnerCnt } = item.raffleData;
                    setMaxTickets(max);
                    setEndTime(new Date(end));
                    setPrice(rafflePrice);
                    setPaymentMethod(rafflePayType === TOKEN_PAY_TYPE ? 'spl' : 'sol');
                    setWinnerCount(winnerCnt);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (wallet.publicKey !== null) {
            const admin = adminValidation(wallet.publicKey);
            setIsAdmin(admin);
            if (admin) {
                updatePage();
            } else {
                navigate('/raffles', { replace: true });
            }
        } else {
            setIsAdmin(false);
            navigate('/raffles', { replace: true });
        }
    }, [wallet.connect]);

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 80px)',
                p: 4,
                backgroundColor: 'background.default',
                color: 'text.primary'
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography fontWeight="700" color="secondary" sx={{ fontSize: '1.5rem' }}>
                            <FormattedMessage id="create-new-raffle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <MainCard
                            content={false}
                            boxShadow
                            sx={{
                                background: theme.palette.mode === 'dark' ? '#09080d' : theme.palette.primary.light
                            }}
                        >
                            <CardMedia>
                                <Image src={image} showLoading={<Loading />} alt="" />
                            </CardMedia>
                            <CardContent sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', py: 1 }}>
                                    <Typography component="p">{name}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', py: 1 }}>
                                    <Typography component="p">{family}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', py: 1 }}>
                                    <Typography component="p">{description}</Typography>
                                </Box>
                            </CardContent>
                        </MainCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={8} xl={9} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <Typography>
                            <FormattedMessage id="choose-payment-method" />
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    my: 2
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="price" />
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FormattedMessage id="price-placeholder">
                                        {(msg) => (
                                            <NumberInput
                                                className="number-control"
                                                name="price"
                                                value={price}
                                                min={0.01}
                                                step={0.01}
                                                precision={2}
                                                onChange={(value?: number) => {
                                                    if (!value) return;
                                                    if (value >= 0.01) {
                                                        setPrice(value);
                                                    }
                                                }}
                                                placeholder={`${msg}`}
                                            />
                                        )}
                                    </FormattedMessage>

                                    <FormControl>
                                        <Select value={paymentMethod} defaultValue="spl" onChange={handlePayment}>
                                            <MenuItem value="spl">{TOKEN_PAY_TYPE}</MenuItem>
                                            <MenuItem value="sol">{DEFAULT_PAY_TYPE}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                    my: 2
                                }}
                            >
                                <Typography>
                                    <FormattedMessage id="choose-reward-type" />
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex'
                                    }}
                                >
                                    <FormControl>
                                        <RadioGroup row onChange={handleRewardType} defaultValue="nft">
                                            <FormControlLabel value="nft" control={<Radio />} label="NFT" />
                                            <FormControlLabel value="whitelist" control={<Radio />} label="Whitelist" />
                                            <FormControlLabel value="spl" control={<Radio />} label={TOKEN_PAY_TYPE} />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                            {rewardType !== 'nft' && (
                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <FormattedMessage id="winner-count" /> {WHITELIST_MAX})
                                    </Typography>
                                    <FormattedMessage id="winner-count-placeholder">
                                        {(msg) => (
                                            <NumberInput
                                                className="number-control"
                                                name="winner-count"
                                                value={winnerCount}
                                                min={1}
                                                max={WHITELIST_MAX}
                                                step={1}
                                                precision={0}
                                                onChange={(value?: number) => {
                                                    if (!value) return;
                                                    if (value >= 1 && value <= WHITELIST_MAX) {
                                                        setWinnerCount(value);
                                                    }
                                                }}
                                                placeholder={`${msg}`}
                                            />
                                        )}
                                    </FormattedMessage>
                                </Grid>
                            )}

                            {rewardType === 'spl' && (
                                <Grid item xs={12} md={6}>
                                    <Typography>
                                        <FormattedMessage id="reward-price" /> ({TOKEN_PAY_TYPE})
                                    </Typography>
                                    <FormattedMessage id="reward-price-placeholder">
                                        {(msg) => (
                                            <NumberInput
                                                className="number-control"
                                                name="reward-price"
                                                value={rewardPrice}
                                                min={0.01}
                                                step={0.01}
                                                precision={2}
                                                onChange={(value?: number) => {
                                                    if (!value) return;
                                                    if (value >= 0.01) {
                                                        setRewardPrice(value);
                                                    }
                                                }}
                                                placeholder={`${msg}`}
                                            />
                                        )}
                                    </FormattedMessage>
                                </Grid>
                            )}

                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <FormattedMessage id="end-time" />
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                        value={endTime}
                                        onChange={(value: Date | null) => {
                                            setEndTime(value);
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <FormattedMessage id="max-tickets" /> {TICKETS_MAX})
                                </Typography>
                                <FormattedMessage id="max-tickets-placeholder">
                                    {(msg) => (
                                        <NumberInput
                                            className="number-control"
                                            name="max-tickets"
                                            value={maxTickets}
                                            min={1}
                                            max={TICKETS_MAX}
                                            step={1}
                                            precision={0}
                                            onChange={(value?: number) => {
                                                if (!value) return;
                                                if (value >= 1 && value <= TICKETS_MAX) {
                                                    setMaxTickets(value);
                                                }
                                            }}
                                            placeholder={`${msg}`}
                                        />
                                    )}
                                </FormattedMessage>
                            </Grid>

                            <Grid item xs={12}>
                                <MainCard border={false} boxShadow sx={{ borderRadius: 3 }}>
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
                                    </Stack>

                                    {/* terms and conditions */}
                                    <TermsAndConditions />
                                </MainCard>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    sx={{ width: '100%', mt: 2, p: 2, textTransform: 'uppercase' }}
                                    onClick={() => handleCreate()}
                                >
                                    <FormattedMessage id="create-new-raffle" />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default RaffleCreate;
