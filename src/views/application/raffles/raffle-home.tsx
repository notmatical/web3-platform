import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Stack, Box, InputAdornment, OutlinedInput, Button, Typography } from '@mui/material';

// web3 imports
import { getRaffleGlobalState } from 'actions/raffle';

// project imports
import RaffleCard from './RaffleCard';
import RaffleCarouselCard from './RaffleCarouselCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

// third-party
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/scss/alice-carousel.scss';
import { useWebhook } from 'hooks/useWebhook';

// test carousel items
const items = [
    <div className="item" data-value="1">
        1
    </div>,
    <div className="item" data-value="2">
        2
    </div>,
    <div className="item" data-value="3">
        3
    </div>,
    <div className="item" data-value="4">
        4
    </div>,
    <div className="item" data-value="5">
        5
    </div>,
    <div className="item" data-value="6">
        6
    </div>,
    <div className="item" data-value="7">
        7
    </div>
];

const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 }
};

// styles
const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : '#fff'
    }
}));

const Raffles = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { sendSuccessEmbed } = useWebhook();

    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('featured');

    const [liveRaffles, setLiveRaffles] = useState<any>();
    const [endedRaffles, setEndedRaffles] = useState<any>();

    const getRaffleList = async () => {
        const res = await getRaffleGlobalState();
        console.log(res);
        if (res !== undefined && res !== null && res?.length !== 0) {
            const liveList: any = [];
            const endList: any = [];

            for (const nft of res) {
                if (nft !== null) {
                    const ticketPriceCosmic = nft.ticketPricePrey.toNumber();
                    const ticketPriceSol = nft.ticketPriceSol.toNumber();
                    const endTimestamp = nft.endTimestamp.toNumber() * 1000;
                    const nftMint = nft.nftMint.toBase58();
                    const count = nft.count.toNumber();
                    const maxEntrants = nft.maxEntrants.toNumber();

                    if (new Date(nft.endTimestamp.toNumber() * 1000) > new Date()) {
                        liveList.push({
                            ticketPriceCosmic,
                            ticketPriceSol,
                            endTimestamp,
                            nftMint,
                            raffleKey: nft.raffleKey,
                            ticketsCount: count,
                            maxEntrants
                        });
                    } else {
                        endList.push({
                            ticketPriceCosmic,
                            ticketPriceSol,
                            endTimestamp,
                            raffleKey: nft.raffleKey,
                            nftMint,
                            ticketsCount: count,
                            maxEntrants
                        });
                    }
                }
            }

            liveList.sort((a: any, b: any) => b.endTimestamp - a.endTimestamp);
            endList.sort((a: any, b: any) => b.endTimestamp - a.endTimestamp);
            setLiveRaffles(liveList);
            setEndedRaffles(endList);

            console.log('LIVE:', liveList);
            console.log('ENDED:', endList);
        }
    };

    useEffect(() => {
        getRaffleList();
    }, []);

    // testing
    const testWebhook = () => {
        sendSuccessEmbed('Test', 'matical.sol', 'yeaaaa');
    };

    return (
        <Grid container spacing={2.5}>
            {/* featured section / carousel */}
            <Grid item xs={12}>
                <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '3rem', pr: 3, pl: 3 }}>
                    FEATURED RAFFLES
                </Typography>
            </Grid>

            <Grid item xs={12} sx={{ pt: '0 !important' }}>
                {/* eslint-disable */}
                <AliceCarousel
                    autoPlay={true}
                    infinite={true}
                    autoPlayInterval={3500}
                    responsive={responsive}
                    disableButtonsControls
                >
                    {endedRaffles !== undefined &&
                        endedRaffles.length !== 0 &&
                        endedRaffles.map((item: any, key: number) => (
                            <Grid key={key} item xs={11.5}>
                                <RaffleCarouselCard
                                    key={key}
                                    ticketPriceCosmic={item.ticketPriceCosmic}
                                    ticketPriceSol={item.ticketPriceSol}
                                    endTimestamp={item.endTimestamp}
                                    nftMint={item.nftMint}
                                    raffleKey={item.raffleKey}
                                    maxEntrants={item.maxEntrants}
                                    ticketsCount={item.ticketsCount}
                                />
                            </Grid>
                        ))}
                </AliceCarousel>
            </Grid>

            {/* buttons / search / filter */}
            <Grid item xs={12}>
                <Stack justifyContent="space-between" alignItems="center" sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}>
                    <Box>
                        <Button
                            variant={tab === 'featured' ? 'contained' : 'text'}
                            color={tab === 'featured' ? 'secondary' : 'primary'}
                            sx={{ borderRadius: 2 }}
                            onClick={() => setTab('featured')}
                        >
                            Featured
                        </Button>

                        <Button
                            variant={tab === 'live' ? 'contained' : 'text'}
                            color={tab === 'live' ? 'secondary' : 'primary'}
                            sx={{ ml: 2, borderRadius: 2 }}
                            onClick={() => setTab('live')}
                        >
                            All Raffles
                        </Button>

                        <Button
                            variant={tab === 'ended' ? 'contained' : 'text'}
                            color={tab === 'ended' ? 'secondary' : 'primary'}
                            sx={{ ml: 2, borderRadius: 3 }}
                            onClick={() => setTab('ended')}
                        >
                            Concluded Raffles
                        </Button>
                    </Box>

                    <Box sx={{ display: { xs: 'block', md: 'block', lg: 'block' } }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ ml: 2, borderRadius: 3 }}
                            onClick={() => navigate('/raffles/create', { replace: true } )}
                        >
                            Create Raffle
                        </Button>

                        <OutlineInputStyle
                            id="input-search-header"
                            value={search}
                            onChange={(e) => console.log('test', e)}
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={5} size="1rem" color={theme.palette.grey[500]} />
                                </InputAdornment>
                            }
                            sx={{ width: 250 }}
                            aria-describedby="search-helper-text"
                            inputProps={{ 'aria-label': 'weight' }}
                        />
                    </Box>
                </Stack>
            </Grid>

            {/* Content */}
            {liveRaffles !== undefined &&
                liveRaffles.length !== 0 &&
                liveRaffles.map((item: any, key: number) => (
                    <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                        <RaffleCard
                            key={key}
                            ticketPriceCosmic={item.ticketPriceCosmic}
                            ticketPriceSol={item.ticketPriceSol}
                            endTimestamp={item.endTimestamp}
                            nftMint={item.nftMint}
                            raffleKey={item.raffleKey}
                            maxEntrants={item.maxEntrants}
                            ticketsCount={item.ticketsCount}
                        />
                    </Grid>
                ))}

            {endedRaffles !== undefined &&
                endedRaffles.length !== 0 &&
                tab === 'ended' &&
                endedRaffles.map((item: any, key: number) => (
                    <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                        <RaffleCard
                            key={key}
                            ticketPriceCosmic={item.ticketPriceCosmic}
                            ticketPriceSol={item.ticketPriceSol}
                            endTimestamp={item.endTimestamp}
                            nftMint={item.nftMint}
                            raffleKey={item.raffleKey}
                            maxEntrants={item.maxEntrants}
                            ticketsCount={item.ticketsCount}
                        />
                    </Grid>
                ))}
        </Grid>
    );
};

export default Raffles;
