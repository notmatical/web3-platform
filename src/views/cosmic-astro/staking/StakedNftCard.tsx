import { Box, CardContent, CardMedia, Grid, Button, Typography, Divider, Tooltip } from '@mui/material';
import moment from 'moment';

// web3
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// project imports
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/MainCard';
import Chip from 'components/@extended/Chip';
import { StakedNftCardProps } from 'types/staking';
import { roleRewards } from 'utils/utils';
import { claimReward, withdrawNft, calculateReward } from 'actions/stake';
import { useToasts } from 'hooks/useToasts';

// third-party
import { useConfirm } from 'material-ui-confirm';

const StakeNftCard = ({ mint, name, image, role, lockTime, stakedTime, startLoading, stopLoading, updatePage }: StakedNftCardProps) => {
    const confirm = useConfirm();
    const reward = roleRewards.find((rRole) => rRole.roles.includes(role));
    const rewardString = `${reward?.dailyReward} $COSMIC / DAY`;

    const wallet = useWallet();
    const { showErrorToast, showInfoToast } = useToasts();

    const onUnstake = async () => {
        try {
            await withdrawNft(
                wallet,
                new PublicKey(mint),
                () => startLoading(),
                () => stopLoading(),
                () => updatePage()
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Claiming
    const tryClaimRewards = async () => {
        await claimReward(
            wallet,
            new PublicKey(mint),
            () => startLoading(),
            () => stopLoading(),
            () => updatePage()
        );
    };

    const onClaim = async () => {
        if (wallet.publicKey === null) return;

        if (lockTime > Math.floor(Date.now() / 1000)) {
            confirm({ description: 'You are attempting to claim within 15 days. You will receive a 25% loss of accumulated rewards.' })
                .then(() => {
                    try {
                        tryClaimRewards();
                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch(() => showErrorToast('You have cancelled the claim process.'));
        } else {
            try {
                tryClaimRewards();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <MainCard
                content={false}
                boxShadow
                sx={{
                    background: '#0b0f19',
                    '&:hover': {
                        transform: 'scale3d(1.03, 1.03, 1)',
                        transition: '.15s'
                    }
                }}
            >
                <CardMedia sx={{ height: 220 }} image={image} title={name} />
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
                    <Grid item xs={12} sx={{ mb: '10px', mt: '5px' }}>
                        <Chip label={role} size="small" chipcolor="secondary" sx={{ mr: '5px' }} />
                        <Chip label={rewardString} size="small" />
                    </Grid>

                    <Divider sx={{ mb: '10px' }} />

                    {/* Staking Stats */}
                    <Grid item xs={12} sx={{ mb: '15px' }}>
                        <Typography variant="h5" fontWeight="500">
                            Staked Duration:
                            <Typography component="span" variant="h4" fontWeight="700" sx={{ ml: '5px' }}>
                                {/* {moment(stakedTime * 1000).diff(Date.now(), 'hours')} hours */}
                                {moment(Date.now()).diff(stakedTime * 1000, 'hours')} hours
                            </Typography>
                        </Typography>
                        {/* <Typography variant="h5" fontWeight="500">
                            Current Rewards:
                            <Typography component="span" variant="h4" fontWeight="700" sx={{ ml: '5px' }}>
                                test
                            </Typography>
                        </Typography> */}
                    </Grid>

                    {/* Management Buttons */}
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button onClick={() => onClaim()} variant="contained" fullWidth>
                                    Claim
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button onClick={() => onUnstake()} variant="outlined" color="error" fullWidth>
                                    Unstake
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Staking End Time */}
                    <Grid item xs={12} sx={{ mt: '8px', mb: '0px !important', textAlign: 'center' }}>
                        <Typography variant="caption">
                            Staking Penalty Ends:
                            <Typography component="span" variant="caption" fontWeight="700" sx={{ ml: '5px' }}>
                                {moment(lockTime * 1000).format('MMMM DD, yyyy')}
                            </Typography>
                        </Typography>
                    </Grid>
                </CardContent>
            </MainCard>
        </>
    );
};

export default StakeNftCard;
