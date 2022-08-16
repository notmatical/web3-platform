/* eslint-disable */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Stack, Box, InputAdornment, OutlinedInput, Button, Tab, Typography } from '@mui/material';

// web3 imports
import { getRaffleGlobalState } from 'actions/raffle';

// project imports
import RaffleCard from './RaffleCard';

// assets
import { IconSearch } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

// third-party
import 'react-alice-carousel/lib/scss/alice-carousel.scss';
import { useWallet } from '@solana/wallet-adapter-react';
import { adminValidation } from 'actions/shared';
import { RaffleEntry } from 'types/raffles';
import { filter, isString, map } from 'lodash';
import { useMeta } from 'contexts/meta/meta';
import { TabContext } from '@mui/lab';
import { TabPanel } from '@mui/lab';
import { FormattedMessage } from 'react-intl';
import { getNFTDetail } from './fetchData';
import { Promise } from 'bluebird';
import { testData } from './dummy/test-data';
import AliceCarousel from 'react-alice-carousel';
import RaffleCarouselCard from './RaffleCarouselCard';
import { DEBUG, RAFFLE_REWARD_TYPES } from 'config/config';

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

const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 }
};

const Raffles = () => {
    const theme = useTheme();
    const wallet = useWallet();
    const navigate = useNavigate();
    const { startLoading, stopLoading } = useMeta();
    const { publicKey } = wallet;

    const [isAdmin, setIsAdmin] = useState(false);
    const [search, setSearch] = useState('');

    const [masterRaffles, setMasterRaffles] = useState<any>([]);
    const [searchResult, setSearchResult] = useState<any>([]);
    const [tabIdx, setTabIdx] = useState('all');

    const getRaffleList = async () => {
        try {
            startLoading();
            const res = DEBUG ? testData : await getRaffleGlobalState();
            const list: Array<RaffleEntry> = [];
            if (res !== undefined && res !== null && res?.length !== 0) {
                await Promise.mapSeries(res, async (nft) => {
                    if (nft !== null) {
                        const ticketPriceToken = nft.ticketPricePrey.toNumber();
                        const ticketPriceSol = nft.ticketPriceSol.toNumber();
                        const endTimestamp = nft.endTimestamp.toNumber() * 1000;
                        const nftMint = nft.nftMint.toBase58();
                        const count = nft.count.toNumber();
                        const maxEntrants = nft.maxEntrants.toNumber();
                        const featured = nft.whitelisted.toNumber() === RAFFLE_REWARD_TYPES.nft;
                        const rewardType = nft.whitelisted.toNumber();
                        const item = await getNFTDetail({
                            wallet,
                            mint: nftMint,
                            raffleKey: nft.raffleKey
                        });
                        const entry = {
                            ticketPriceToken,
                            ticketPriceSol,
                            endTimestamp,
                            nftMint,
                            raffleKey: nft.raffleKey,
                            ticketsCount: count,
                            maxEntrants,
                            featured,
                            rewardType,
                            ...item
                        };

                        list.push(entry);
                    }
                });
                list.sort((a, b) => b.endTimestamp - a.endTimestamp);
            }
            setMasterRaffles(list);
            setSearchResult([...list]);
        } catch (error) {
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const handleSearch = (event: any) => {
        const {
            target: { value }
        } = event;
        setSearch(value);
        if (value && isString(value) && value.length > 0 && masterRaffles.length > 0) {
            setSearchResult(filter(masterRaffles, ({ name = '', family = '' }) => name.includes(value) || family.includes(value)));
        } else {
            setSearchResult([...masterRaffles]);
        }
    };

    const updatePage = async () => {
        const admin = adminValidation(publicKey);
        setIsAdmin(admin);
        await getRaffleList();
    };

    useEffect(() => {
        updatePage();
    }, [publicKey]);

    return (
        <TabContext value={tabIdx}>
            <Grid container spacing={2.5}>
                {/* featured section / carousel */}
                {/* {filter(masterRaffles, (item: any) => item.featured && item.endTimestamp > new Date().getTime()).length > 0 && (
                    <> */}
                        {/* <Grid item xs={12}>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '1.5rem', py: 2 }}>
                                <FormattedMessage id="featured-raffles" />
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sx={{ pt: '0 !important' }}>
                            <AliceCarousel
                                autoPlay={true}
                                infinite={true}
                                autoPlayInterval={3500}
                                responsive={responsive}
                                disableButtonsControls
                            >
                                {map(
                                    filter(masterRaffles, (item: any) => item.featured && item.endTimestamp > new Date().getTime()),
                                    (item: any, key: number) => (
                                        <Grid key={key} item xs={11.5}>
                                            <RaffleCarouselCard
                                                key={key}
                                                ticketPriceToken={item.ticketPriceToken}
                                                ticketPriceSol={item.ticketPriceSol}
                                                endTimestamp={item.endTimestamp}
                                                nftMint={item.nftMint}
                                                raffleKey={item.raffleKey}
                                                maxEntrants={item.maxEntrants}
                                                ticketsCount={item.ticketsCount}
                                                isAdmin={isAdmin}
                                            />
                                        </Grid>
                                    )
                                )}
                            </AliceCarousel>
                        </Grid> */}
                    {/* </>
                )} */}
                {/* buttons / search / filter */}
                <Grid item xs={12}>
                    <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ flexDirection: { xs: 'column', md: 'row', lg: 'row' } }}
                    >
                        <Box>
                            {/* {filter(masterRaffles, (item: any) => item.featured && item.endTimestamp > new Date().getTime()).length > 0 && (
                                <Button
                                    variant={tabIdx === 'featured' ? 'contained' : 'text'}
                                    color={tabIdx === 'featured' ? 'secondary' : 'primary'}
                                    sx={{ borderRadius: 2 }}
                                    onClick={() => setTabIdx('featured')}
                                >
                                    <FormattedMessage id="featured" />
                                </Button>
                            )} */}
                            <Button
                                variant={tabIdx === 'all' ? 'contained' : 'text'}
                                color={tabIdx === 'all' ? 'secondary' : 'primary'}
                                sx={{ borderRadius: 2 }}
                                onClick={() => setTabIdx('all')}
                            >
                                <FormattedMessage id="all-raffles" />
                            </Button>

                            <Button
                                variant={tabIdx === 'live' ? 'contained' : 'text'}
                                color={tabIdx === 'live' ? 'secondary' : 'primary'}
                                sx={{ ml: 2, borderRadius: 2 }}
                                onClick={() => setTabIdx('live')}
                            >
                                <FormattedMessage id="live-raffles" />
                            </Button>

                            <Button
                                variant={tabIdx === 'ended' ? 'contained' : 'text'}
                                color={tabIdx === 'ended' ? 'secondary' : 'primary'}
                                sx={{ ml: 2, borderRadius: 3 }}
                                onClick={() => setTabIdx('ended')}
                            >
                                <FormattedMessage id="concluded-raffles" />
                            </Button>
                        </Box>

                        <Box sx={{ display: { xs: 'block', md: 'block', lg: 'block' } }}>
                            {isAdmin && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ ml: 2, borderRadius: 3 }}
                                    onClick={() => navigate('/raffles/create', { replace: true })}
                                >
                                    <FormattedMessage id="create-raffle" />
                                </Button>
                            )}

                            <OutlineInputStyle
                                id="input-search-header"
                                value={search}
                                onChange={(e) => handleSearch(e)}
                                placeholder="Search"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
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
                <TabPanel value="featured" sx={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        {map(
                            filter(searchResult, ({ endTimestamp, featured }) => featured && endTimestamp > new Date().getTime()),
                            (item: any, key: number) => (
                                <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                                    <RaffleCard key={key} {...item} isAdmin={isAdmin} />
                                </Grid>
                            )
                        )}
                    </Grid>
                </TabPanel>
                <TabPanel value="all" sx={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        {map(searchResult, (item: any, key: number) => (
                            <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                                <RaffleCard key={key} {...item} isAdmin={isAdmin} />
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value="live" sx={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        {map(
                            filter(searchResult, ({ endTimestamp }) => endTimestamp > new Date().getTime()),
                            (item: any, key: number) => (
                                <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                                    <RaffleCard key={key} {...item} isAdmin={isAdmin} />
                                </Grid>
                            )
                        )}
                    </Grid>
                </TabPanel>
                <TabPanel value="ended" sx={{ width: '100%' }}>
                    <Grid container spacing={3}>
                        {map(
                            filter(searchResult, ({ endTimestamp }) => endTimestamp <= new Date().getTime()),
                            (item: any, key: number) => (
                                <Grid key={key} item xs={12} sm={6} md={4} lg={3}>
                                    <RaffleCard key={key} {...item} isAdmin={isAdmin} />
                                </Grid>
                            )
                        )}
                    </Grid>
                </TabPanel>
            </Grid>
        </TabContext>
    );
};

export default Raffles;
