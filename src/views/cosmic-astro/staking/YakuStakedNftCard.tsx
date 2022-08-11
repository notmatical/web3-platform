import { useEffect, useState } from 'react';

// material-ui
import { Box, CardContent, CardMedia, Grid, Button, Typography, Divider, Avatar } from '@mui/material';
import { Image } from 'mui-image';
import { useTheme } from '@mui/material/styles';
import HashLoader from 'react-spinners/HashLoader';

// web3
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// third party
import { FormattedMessage } from 'react-intl';

// project imports
import MainCard from 'components/MainCard';
import Chip from 'components/@extended/Chip';
import { YakuStakedNftCardProps } from 'types/staking';
import { claimYakuReward, loadYakuProgram, unstakeYakuNft } from 'actions/yakuStake';
import { solConnection } from 'actions/shared';
import { YAKU_TOKEN_ICON } from 'config/config';
import { useToasts } from 'hooks/useToasts';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';

const YakuStakeNftCard = ({
    mint,
    name,
    image,
    reward,
    traits,
    lastClaim,
    interval,
    amount,
    startLoading,
    updatePage,
    stopLoading
}: YakuStakedNftCardProps) => {
    const calcRewardAmount = () => (((Math.floor(Date.now() / 1000) - lastClaim) / interval) * amount) / LAMPORTS_PER_SOL;
    const getRewardString = (rewardAmount: number, precision = 2) =>
        `${rewardAmount?.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '0'}`;
    const rewardPerDayString = (+reward / LAMPORTS_PER_SOL).toFixed(2);

    const wallet: any = useAnchorWallet();
    const theme = useTheme();
    const { showInfoToast, showErrorToast } = useToasts();
    const [rewardString, setRewardString] = useState('0');

    const onUnstake = async () => {
        if (wallet.publicKey === null) return;
        try {
            startLoading();
            const program = await loadYakuProgram(solConnection, wallet);
            await unstakeYakuNft(program, wallet, new PublicKey(mint));
            showInfoToast('You have successfully unstaked your NFT.');
            updatePage(false);
        } catch (error) {
            showErrorToast('An error has occured while unstaking your nft, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    // Claiming
    const tryClaimRewards = async () => {
        if (wallet.publicKey === null) return;
        try {
            startLoading();
            const program = await loadYakuProgram(solConnection, wallet);
            await claimYakuReward(program, wallet, new PublicKey(mint));
            showInfoToast('You have successfully claimed your NFTs reward.');
            updatePage();
        } catch (error) {
            showErrorToast('An error has occured while claiming your rewards, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    const onClaim = async () => {
        if (wallet.publicKey === null) return;
        try {
            tryClaimRewards();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setRewardString(getRewardString(calcRewardAmount()));
        }, 1000);
        return () => clearInterval(timer);
    }, [mint]);

    return (
        <>
            {name ? (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        background: theme.palette.mode === 'dark' ? '#09080d' : theme.palette.primary.light,
                        '&:hover': {
                            transform: 'scale3d(1.03, 1.03, 1)',
                            transition: '.15s'
                        }
                    }}
                >
                    <CardMedia sx={{ minHeight: 200, display: 'flex', alignItems: 'center' }}>
                        <Image
                            src={image}
                            style={{ aspectRatio: '1 / 1' }}
                            alt={name}
                            fit="cover"
                            showLoading={<HashLoader size={32} color="#c300ff" />}
                        />
                    </CardMedia>
                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                        {/* name */}
                        <Box display="flex" alignItems="center">
                            <Typography
                                fontWeight="800"
                                color="secondary"
                                sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                            >
                                {name}
                            </Typography>
                        </Box>

                        {/* Role/Token Amount */}
                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px', display: 'flex', justifyContent: 'space-between' }}>
                            <FormattedMessage id="per-day">
                                {(msg) => (
                                    <Chip
                                        icon={<img src={YAKU_TOKEN_ICON} alt="" style={{ width: 16, borderRadius: 5000 }} />}
                                        label={`${rewardPerDayString} ${msg}`}
                                        size="small"
                                        color="secondary"
                                    />
                                )}
                            </FormattedMessage>

                            <Chip
                                icon={<img src={YAKU_TOKEN_ICON} alt="" style={{ width: 16, borderRadius: 5000 }} />}
                                label={rewardString}
                                size="small"
                                color="primary"
                            />
                        </Grid>

                        <Divider sx={{ mb: '10px' }} />

                        {/* Management Buttons */}
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Button onClick={() => onClaim()} variant="contained" fullWidth color="warning">
                                        <FormattedMessage id="claim" />
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button onClick={() => onUnstake()} variant="outlined" color="error" fullWidth>
                                        <FormattedMessage id="unstake" />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </MainCard>
            ) : (
                <SkeletonProductPlaceholder />
            )}
        </>
    );
};

export default YakuStakeNftCard;
