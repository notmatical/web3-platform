/* eslint-disable */
import { ReactElement, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Button, Tooltip, Tab, Box, IconButton } from '@mui/material';

// web3 imports
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { calculateAllRewards, claimRewardAll } from 'actions/stake';

// project imports
import RevenueCard from 'components/cards/RevenueCard';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';
import MainCard from 'components/cards/MainCard';
import StakeEmpty from './StakeEmpty';
import StakedNftCard from './StakedNftCard';
import NftCard from './StakeNftCard';
import { useSolPrice } from 'contexts/CoinGecko';
import { formatNumber, formatUSD } from 'utils/utils';
import { useMeta } from 'contexts/meta/meta';
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';

// assets
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import EqualizerTwoToneIcon from '@mui/icons-material/EqualizerTwoTone';

import {
    getGlobalData,
    getUserPoolData,
    getTokenDistribution,
    getYakuStakedNfts,
    getUnstakedNfts,
    getMagicEdenFloorPrice,
    calculateAllYakuRewards
} from './fetchData';
import YakuStakeNftCard from './YakuStakedNftCard';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
    claimRewardV2Multiple,
    fetchMetadata,
    getStakingState,
    loadYakuProgram,
    stakeNftV2Multiple,
    unStakeNftV2Multiple
} from 'actions/yakuStake';
import { chunk, each, find, findIndex, map, min, sortBy, sumBy } from 'lodash';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { fastConnection, getNftMetaData, solConnection } from 'actions/shared';
import { RefreshOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { YAKU_NFT } from 'types/staking';
import { queries } from '../../../graphql/graphql';
import { ApolloQueryResult, useQuery } from '@apollo/client';
import { Promise } from 'bluebird';

function Staking() {
    const theme = useTheme();

    const { data: caStats, refetch: refetchCaStats } = useQuery(queries.GET_COLLECTION_STATS, {
        variables: { symbol: 'cosmic_astronauts' },
        fetchPolicy: 'network-only'
    });
    const { data: oniStats, refetch: refetchOniStats } = useQuery(queries.GET_COLLECTION_STATS, {
        variables: { symbol: 'yaku_corp' },
        fetchPolicy: 'network-only'
    });
    const { data: capsuleStats, refetch: refetchCapsuleStats } = useQuery(queries.GET_COLLECTION_STATS, {
        variables: { symbol: 'yaku_corp_capsulex' },
        fetchPolicy: 'network-only'
    });
    const { data: yakuXStats, refetch: refetchYakuXStats } = useQuery(queries.GET_COLLECTION_STATS, {
        variables: { symbol: 'yaku_x' },
        fetchPolicy: 'network-only'
    });

    const { showInfoToast, showErrorToast } = useToasts();
    const { startLoading, stopLoading } = useMeta();
    const wallet: any = useAnchorWallet();

    const [isLoading, setIsLoading] = useState(false);
    const [totalStaked, setTotalStaked] = useState(0);
    const [valueLocked, setValueLocked] = useState(0);
    const [tokenDistributed, setTokenDistributed] = useState(0);
    const [dailyYield, setDailyYield] = useState(0);

    const [nftList, setNftList] = useState<any>();
    const [stakedNfts, setStakedNfts] = useState<any>();
    const [stakedYakuNfts, setStakedYakuNfts] = useState<any>();
    const [metaDataCache, setMetaDataCache] = useState<any>({});
    const [rewardAmount, setRewardAmount] = useState(0);
    const [yakuRewardAmount, setYakuRewardAmount] = useState(0);

    const [tabIdx, setTabIdx] = useState('1');
    const solPrice = useSolPrice();

    let timer: any;

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabIdx(newValue);
    };

    // Claim all COSMIC
    const claimAll = async () => {
        try {
            startLoading();
            await claimRewardAll(wallet);
            showInfoToast('You have claimed all of your $COSMIC.');
            updatePage();
        } catch (error) {
            showErrorToast('An error has occured while claiming your rewards, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const claimAllYaku = async () => {
        try {
            startLoading();
            const program = await loadYakuProgram(solConnection, wallet);
            const mintList = map(stakedYakuNfts, ({ mintAddress }) => new PublicKey(mintAddress));
            await claimRewardV2Multiple(solConnection, program, wallet, mintList);
            showInfoToast('You have claimed all of your $YAKU.');
            updatePage();
        } catch (error) {
            showErrorToast('An error has occured while claiming your rewards, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const stakeAll = async () => {
        try {
            startLoading();
            const program = await loadYakuProgram(fastConnection, wallet);
            const mintList = map(nftList, ({ mintAddress }) => new PublicKey(mintAddress));
            await stakeNftV2Multiple(solConnection, program, wallet, mintList);
            showInfoToast('You have staked all of your NFTs.');
            updatePage();
        } catch (error) {
            showErrorToast('An error has occured while staking your nfts, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const unstakeAll = async () => {
        try {
            startLoading();
            const program = await loadYakuProgram(fastConnection, wallet);
            const mintList = map(stakedYakuNfts, ({ mintAddress }) => new PublicKey(mintAddress));
            await unStakeNftV2Multiple(solConnection, program, wallet, mintList);
            showInfoToast('You have unstaked all of your NFTs.');
            updatePage();
        } catch (error) {
            showErrorToast('An error has occured while unstaking your nfts, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const getFP = async (
        refetch: (variables?: Partial<{ symbol: string }> | undefined) => Promise<ApolloQueryResult<any>>,
        symbol: string
    ) => {
        const { data } = await refetch({ symbol });
        let fp = data?.getStats?.floorPrice ?? 0;
        if (!fp) {
            ({ floorPrice: fp = 0 } = await getMagicEdenFloorPrice(symbol));
        }
        return fp;
    };

    const getStats = async () => {
        try {
            const program = await loadYakuProgram(solConnection, wallet);
            const { data } = await refetchCaStats({ symbol: 'cosmic_astronauts' });
            const caFP = data?.getStats?.floorPrice ?? 0;
            const { totalStaked = 0, valueLocked: caValueLocked = 0 } = (await getGlobalData(solPrice, caFP)) || {};
            const { count = 0 } = await getStakingState(program);
            const oniFP = await getFP(refetchOniStats, 'yaku_corp');
            const capsuleFP = await getFP(refetchCapsuleStats, 'yaku_corp_capsulex');
            const xFP = await getFP(refetchYakuXStats, 'yaku_x');
            const valueLocked = caValueLocked + (min([oniFP, capsuleFP, xFP]) / LAMPORTS_PER_SOL) * count * solPrice;

            setTotalStaked(totalStaked + count);
            setValueLocked(valueLocked);
        } catch (error) {
            console.error(error);
        }
    };

    const getStakedCA = async () => {
        try {
            const { staked = [], claimReward = 0 } = await getUserPoolData({ wallet });
            const newList: any[] = [...staked];
            const paged = chunk(staked, 5);
            await Promise.each(paged, async (pagedList) => {
                await Promise.each(pagedList, async (item: any) => {
                    try {
                        const uri = await getNftMetaData(new PublicKey(item.nftAddress));
                        const resp = await fetch(uri);
                        const res = await resp.json();
                        const idx = findIndex(newList, ({ nftAddress }: any) => nftAddress === item.nftAddress);
                        newList[idx] = {
                            ...item,
                            name: res.name,
                            image: res.image,
                            role: res.attributes.find((o: any) => o.trait_type === 'Role').value
                        };
                    } catch (error) {
                        console.error(error);
                    }
                });
                setStakedNfts(sortBy(newList, 'name'));
            });
            setStakedNfts(sortBy(newList, 'name'));
            setRewardAmount(claimReward);
        } catch (error) {
            console.error(error);
        }
    };

    const getUnstakedList = async () => {
        try {
            const unstakedNftList = await getUnstakedNfts({ wallet, shouldfetchJson: false });
            setNftList(unstakedNftList);
            if (!unstakedNftList || unstakedNftList.length === 0) {
                setTabIdx('2');
            }
            return unstakedNftList;
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    const getStakedList = async () => {
        try {
            const { staked = [] } = await getYakuStakedNfts({ wallet, shouldfetchJson: false, cache: metaDataCache });
            setStakedYakuNfts(staked);
            return staked;
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    const getUnstakedJSONs = async (unstaked: YAKU_NFT[]) => {
        const cache: any = { ...metaDataCache };
        const newList: any[] = [...unstaked];
        const paged = chunk(unstaked, 5);
        await Promise.each(paged, async (pagedList) => {
            await Promise.each(pagedList, async (item: any) => {
                if (!cache[item.mintAddress]) {
                    const res = await fetchMetadata(item.uri, item.mintAddress);
                    cache[item.mintAddress] = { ...item, ...res };
                    const idx = findIndex(newList, ({ mintAddress }: any) => mintAddress === item.mintAddress);
                    newList[idx] = { ...item, ...res };
                }
            });
            setNftList(sortBy(newList, 'name'));
        });
        setMetaDataCache(cache);
        setNftList(sortBy(newList, 'name'));
    };
    const getStakedJSONs = async (staked: YAKU_NFT[]) => {
        const cache: any = { ...metaDataCache };
        const newList: any[] = [...staked];
        const paged = chunk(staked, 5);
        await Promise.each(paged, async (pagedList) => {
            await Promise.each(pagedList, async (item: any) => {
                if (!cache[item.mint_address]) {
                    const uri = await getNftMetaData(new PublicKey(item.mint_address));
                    const res = await fetchMetadata(uri, item.mint_address);
                    cache[item.mint_address] = { ...item, ...res };
                    const idx = findIndex(newList, ({ mint_address }: any) => mint_address === item.mint_address);
                    newList[idx] = { ...item, ...res };
                }
            });
            setStakedYakuNfts(sortBy(newList, 'name'));
        });
        setMetaDataCache(cache);
        setStakedYakuNfts(sortBy(newList, 'name'));

        const dailyYield = sumBy(newList, ({ reward = 0 }) => +reward / LAMPORTS_PER_SOL);
        setDailyYield(dailyYield);
    };

    const refreshYakuReward = () => {
        timer = setInterval(() => {
            const rewardAmount = calculateAllYakuRewards(stakedYakuNfts);
            if (rewardAmount) {
                setYakuRewardAmount(rewardAmount);
            }
        }, 1000);
    };

    const updatePage = async () => {
        setIsLoading(true);
        const unstaked = await getUnstakedList();
        await getStakedCA();
        const staked = await getStakedList();
        setIsLoading(false);
        await getUnstakedJSONs(unstaked);
        await getStakedJSONs(staked);
        await getStats();
        const tokenDistributed = await getTokenDistribution();
        setTokenDistributed(tokenDistributed);
    };

    useEffect(() => {
        if (!wallet || wallet.publicKey === null) {
            return;
        }
        updatePage();

        let timerId = 0;
        const queryClaimAmount = async () => {
            const claimReward = await calculateAllRewards(wallet);
            setRewardAmount(claimReward);

            startTimer();
        };

        const startTimer = () => {
            timerId = window.setTimeout(async () => {
                await queryClaimAmount();
            }, 35000);
        };

        queryClaimAmount();
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    useEffect(() => {
        refreshYakuReward();
        return () => clearInterval(timer);
    }, [stakedYakuNfts]);

    let stakedNftResult: ReactElement | ReactElement[] = <></>;
    if (stakedNfts && stakedNfts.length !== 0) {
        stakedNftResult = stakedNfts.map((nft: any, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <StakedNftCard
                    mint={nft.nftAddress}
                    name={nft.name}
                    image={nft.image}
                    role={nft.role}
                    lockTime={nft.lockTime}
                    rate={nft.rate}
                    rewardTime={nft.rewardTime}
                    stakedTime={nft.stakedTime}
                    startLoading={() => startLoading()}
                    stopLoading={() => stopLoading()}
                    updatePage={() => updatePage()}
                    loading={isLoading}
                />
            </Grid>
        ));
    } else {
        stakedNftResult = <></>;
    }

    let stakedYakuNftResult: ReactElement | ReactElement[] = <></>;
    if (stakedYakuNfts && stakedYakuNfts.length !== 0) {
        stakedYakuNftResult = stakedYakuNfts.map((nft: any, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <YakuStakeNftCard
                    mint={nft.mintAddress}
                    name={nft.name}
                    image={nft.image}
                    reward={nft.reward}
                    traits={nft.traits}
                    interval={nft.interval}
                    lastClaim={nft.lastClaim}
                    amount={nft.amount}
                    startLoading={() => startLoading()}
                    stopLoading={() => stopLoading()}
                    updatePage={() => updatePage()}
                    loading={isLoading}
                />
            </Grid>
        ));
    } else {
        stakedYakuNftResult = <></>;
    }

    let nftResult: ReactElement | ReactElement[] = <></>;
    if (nftList && nftList.length !== 0) {
        nftResult = nftList.map((nft: any, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <NftCard
                    mint={nft.mintAddress}
                    reward={nft.reward}
                    name={nft.name}
                    image={nft.image}
                    traits={nft.traits}
                    startLoading={() => startLoading()}
                    stopLoading={() => stopLoading()}
                    updatePage={() => updatePage()}
                    loading={isLoading}
                />
            </Grid>
        ));
    } else if (nftList && nftList.length === 0) {
        nftResult = (
            <Grid item xs={12}>
                <StakeEmpty />
            </Grid>
        );
    }

    return (
        <>
            <Grid container spacing={gridSpacing} sx={{ pb: 3 }}>
                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="total-staked" />}
                        secondary={formatNumber.format(totalStaked)}
                        content={<FormattedMessage id="vault-holdings" />}
                        iconPrimary={AccountBalanceTwoToneIcon}
                        color={theme.palette.secondary.dark}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="tvl" />}
                        secondary={formatUSD.format(valueLocked)}
                        content={<FormattedMessage id="tvl-desc" />}
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={theme.palette.primary.dark}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="distributed" />}
                        secondary={formatNumber.format(tokenDistributed)}
                        content={<FormattedMessage id="est-circular-supply" />}
                        iconPrimary={EqualizerTwoToneIcon}
                        color={theme.palette.warning.main}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary={<FormattedMessage id="daily-yield" />}
                        secondary={formatNumber.format(dailyYield)}
                        content={<FormattedMessage id="daily-yield-desc" />}
                        iconPrimary={FormatListBulletedTwoToneIcon}
                        color={theme.palette.info.dark}
                    />
                </Grid>
            </Grid>

            <TabContext value={tabIdx}>
                <MainCard
                    title={
                        <Box
                            sx={{
                                display: 'flex'
                            }}
                        >
                            <TabList
                                onChange={handleTabChange}
                                sx={{
                                    marginTop: '-12px',
                                    '.MuiTabs-flexContainer': { borderBottom: 'none' }
                                }}
                                textColor="secondary"
                                indicatorColor="secondary"
                            >
                                <Tab label={<FormattedMessage id="unstaked" />} id="unstakedTab" value="1" />
                                <Tab label={<FormattedMessage id="staked" />} id="stakedTab" value="2" />
                            </TabList>
                        </Box>
                    }
                    secondary={
                        <>
                            {tabIdx === '1' && (
                                <>
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        disabled={nftList && !nftList.length}
                                        onClick={() => stakeAll()}
                                        sx={{ ml: 2 }}
                                    >
                                        <FormattedMessage id="stake-all" />
                                    </Button>
                                </>
                            )}
                            {tabIdx === '2' && (
                                <>
                                    <Button color="error" variant="contained" onClick={() => unstakeAll()} sx={{ ml: 2 }}>
                                        <FormattedMessage id="unstake-all" />
                                    </Button>
                                    {rewardAmount > 0 && (
                                        <Tooltip
                                            title="You may lose 25% of accumlated rewards if claiming within 15 days of the original staking date."
                                            arrow
                                        >
                                            <Button color="secondary" variant="contained" onClick={() => claimAll()} sx={{ ml: 2 }}>
                                                <FormattedMessage id="claim-all" /> ({rewardAmount.toLocaleString()} $COSMIC)
                                            </Button>
                                        </Tooltip>
                                    )}
                                    <Button color="warning" variant="contained" onClick={() => claimAllYaku()} sx={{ ml: 2 }}>
                                        <FormattedMessage id="claim-all" /> ({yakuRewardAmount.toFixed(3).toLocaleString()} $YAKU)
                                    </Button>
                                </>
                            )}
                            <IconButton sx={{ ml: 2 }} onClick={() => updatePage()}>
                                <RefreshOutlined />
                            </IconButton>
                        </>
                    }
                >
                    {/* Content */}
                    <TabPanel value="1">
                        <Grid container spacing={gridSpacing}>
                            {isLoading ? (
                                [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                    <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                                        <SkeletonProductPlaceholder />
                                    </Grid>
                                ))
                            ) : (
                                <>{nftResult}</>
                            )}
                        </Grid>
                    </TabPanel>

                    <TabPanel value="2">
                        <Grid container spacing={gridSpacing}>
                            {isLoading ? (
                                [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                    <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                                        <SkeletonProductPlaceholder />
                                    </Grid>
                                ))
                            ) : (
                                <>
                                    {stakedNftResult}
                                    {stakedYakuNftResult}
                                </>
                            )}
                        </Grid>
                    </TabPanel>
                </MainCard>
            </TabContext>
        </>
    );
}

export default Staking;
