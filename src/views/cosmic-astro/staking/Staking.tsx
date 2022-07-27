/* eslint-disable */
import { ReactElement, useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Button, Tooltip, CircularProgress, Stack, Alert } from '@mui/material';
import { IconCurrencyDollar, IconLock, IconBolt } from '@tabler/icons';

// web3 imports
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { calculateAllRewards, claimRewardAll, getGlobalState, getUserPoolState } from 'actions/stake';
import { solConnection, getNftMetaData } from 'actions/shared';
import { NFT_CREATOR } from 'config/config';

// project imports
import RoundIconCard from 'components/cards/RoundIconCard';
import RevenueCard from 'components/cards/RevenueCard';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/cards/MainCard';
import StakeEmpty from './StakeEmpty';
import StakedNftCard from './StakedNftCard';
import NftCard from './StakeNftCard';
import { useSolPrice } from 'contexts/CoinGecko';
import { roleRewards, formatNumber, formatUSD } from 'utils/utils';
import { useMeta } from 'contexts/meta/meta';
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';

// assets
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import EqualizerTwoToneIcon from '@mui/icons-material/EqualizerTwoTone';

// third party
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';

// graphql
import { useQuery } from '@apollo/client';
import { queries } from '../../../graphql/graphql';

function Staking() {
    const theme = useTheme();

    const { showInfoToast } = useToasts();
    const { startLoading, stopLoading } = useMeta();
    const wallet = useWallet();

    const [isLoading, setIsLoading] = useState(false);
    const [totalStaked, setTotalStaked] = useState(0);
    const [valueLocked, setValueLocked] = useState(0);
    const [tokenDistributed, setTokenDistributed] = useState(0);
    const [dailyYield, setDailyYield] = useState(0);

    const [nftList, setNftList] = useState<any>();
    const [stakedNfts, setStakedNfts] = useState<any>();
    const [rewardAmount, setRewardAmount] = useState(0);

    const { data } = useQuery(queries.GET_COLLECTION_STATS, { variables: { symbol: 'cosmic_astronauts' } });
    const solPrice = useSolPrice();

    const getUnstakedNfts = async () => {
        if (wallet.publicKey !== null) {
            const nftsList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
            const list: any = [];
            for (const item of nftsList) {
                if (item.data.creators === undefined) continue;
                console.log(item.data.creators[0].verified)
                if (item.data.creators[0].address === NFT_CREATOR && item.data.creators[0].verified == true) {
                    try {
                        await axios.get(item.data.uri).then((res) => {
                            list.push({
                                mintAddress: item.mint,
                                name: res.data.name,
                                image: res.data.image,
                                role: res.data.attributes.find((o: any) => o.trait_type === 'Role').value
                            })
                        }).catch((err) => {
                            console.log(err);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            setNftList(list);
        }
    }

    const getGlobalData = async () => {
        const globalPoolData = await getGlobalState();
        if (globalPoolData === null) return;

        setTotalStaked(globalPoolData.totalAmount.toNumber());
        setValueLocked(globalPoolData.totalAmount.toNumber() * data.getStats.floorPrice / 1000000000 * solPrice);
    }

    const getUserPoolData = async () => {
        if (wallet.publicKey === null) return;

        const userPoolData = await getUserPoolState(wallet);
        if (userPoolData === null) return;

        const claimReward = await calculateAllRewards(wallet);
        setRewardAmount(claimReward);

        const count = userPoolData.itemCount.toNumber();
        const staked: any = [];
        let reward: number = 0;
        if (count !== 0) {
            for (let i = 0; i < count; i++) {
                const uri = await getNftMetaData(new PublicKey(userPoolData.items[i].nftAddr.toBase58()))
                await axios.get(uri).then((res) => {
                    staked.push({
                        name: res.data.name,
                        image: res.data.image,
                        role: res.data.attributes.find((o: any) => o.trait_type === 'Role').value,
                        lockTime: userPoolData.items[i].lockTime.toNumber(),
                        model: userPoolData.items[i].model.toNumber(),
                        nftAddress: userPoolData.items[i].nftAddr.toBase58(),
                        rate: userPoolData.items[i].rate.toNumber(),
                        rewardTime: userPoolData.items[i].rewardTime.toNumber(),
                        stakedTime: userPoolData.items[i].stakeTime.toNumber()
                    });

                    const rReward = roleRewards.find((rRole) => rRole.roles.includes(res.data.attributes.find((o: any) => o.trait_type === 'Role').value));
                    reward = reward += rReward?.dailyReward || 0;
                }).catch((err) => {
                    console.log(err);
                });
            }
            setStakedNfts(staked);
            setDailyYield(reward);
        }

        // setIsLoading(false);
    }

    const getTokenDistribution = async () => {
        await axios.get('https://public-api.solscan.io/account/tokens?account=5iLjJh7ovqrg6uV7gJmAi73jhuV24bF2N8H6GYzsGAiX')
            .then((res) => {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].tokenAccount === "C1zWiW8jA3rxKkMa5q8tADXpi8LXWciACQV3VG3KFgw") {
                        setTokenDistributed(160000000 - res.data[i].tokenAmount.uiAmount);
                        break;
                    }
                }
            })
            .catch((err) => console.log(err));
    }

    const claimAll = async() => {
        try {
            await claimRewardAll(wallet,
                () => startLoading(),
                () => stopLoading(),
                () => updatePage()
            );
        } catch (error) {
            console.log(error);
        }
    }

    const updatePage = () => {
        getUnstakedNfts();
        getGlobalData();
        getUserPoolData();
        getTokenDistribution();

        // setTimeout(() => {
        //     getValueLocked();
        // }, 5000);

        // setIsLoading(false);
    }

    useEffect(() => {
        updatePage();

        let timerId = 0;
        const queryClaimAmount = async () => {
            const claimReward = await calculateAllRewards(wallet);
            setRewardAmount(claimReward);

            startTimer();
        };

        const startTimer = () => {
            timerId = window.setTimeout(async () => {
                queryClaimAmount();
            }, 35000);
        };

        queryClaimAmount();
        return () => {
            clearTimeout(timerId);
        };
    }, [setRewardAmount]);

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
        ))
    } else {
        stakedNftResult = <></>;
    }

    let nftResult: ReactElement | ReactElement[] = <></>;
    if (nftList && nftList.length !== 0) {
        nftResult = nftList.map((nft: any, index: number) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <NftCard
                    mint={nft.mintAddress}
                    role={nft.role}
                    name={nft.name}
                    image={nft.image}
                    startLoading={() => startLoading()}
                    stopLoading={() => stopLoading()}
                    updatePage={() => updatePage()}
                    loading={isLoading}
                />
            </Grid>
        ));
    } else if (stakedNfts && stakedNfts.length === 0) {
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
                        primary="Total Staked"
                        secondary={formatNumber.format(totalStaked)}
                        content="Current Vault Holdings"
                        iconPrimary={AccountBalanceTwoToneIcon}
                        color={theme.palette.secondary.dark}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary="TVL ($USD)"
                        secondary={formatUSD.format(valueLocked)}
                        content="Total Value Locked in USD"
                        iconPrimary={MonetizationOnTwoToneIcon}
                        color={theme.palette.primary.dark}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary="$COSMIC Distributed"
                        secondary={formatNumber.format(tokenDistributed)}
                        content="Estimated Circulating Supply"
                        iconPrimary={EqualizerTwoToneIcon}
                        color={theme.palette.warning.main}
                    />
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                    <RevenueCard
                        primary="$COSMIC Daily Yield"
                        secondary={formatNumber.format(dailyYield)}
                        content="Daily Yield for Staked NFTs"
                        iconPrimary={FormatListBulletedTwoToneIcon}
                        color={theme.palette.info.dark}
                    />
                </Grid>
            </Grid>

            <MainCard
                title="Your NFTs"
                secondary={
                    <>
                        <Tooltip
                            title="You may lose 25% of accumlated rewards if claiming within 15 days of the original staking date."
                            arrow
                        >
                            <Button color="secondary" variant="contained" onClick={() => claimAll()} sx={{ ml: 2 }}>
                                Claim All ({(rewardAmount).toLocaleString()} $COSMIC)
                            </Button>
                        </Tooltip>
                    </>
                }
            >
                {/* Content */}
                <Grid container spacing={gridSpacing}>
                    {isLoading
                        ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                              <Grid key={item} item xs={12} sm={6} md={4} lg={3}>
                                  <SkeletonProductPlaceholder />
                              </Grid>
                          ))
                        : stakedNftResult}
                        {nftResult}
                </Grid>
            </MainCard>
        </>
    );
}

export default Staking;
