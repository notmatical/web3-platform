import { Box, CardContent, CardMedia, Grid, Button, Typography, Divider } from '@mui/material';

// web3
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

// project imports
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/MainCard';
import Chip from 'components/@extended/Chip';
import { StakingNftCardProps } from 'types/staking';
import { roleRewards } from 'utils/utils';
import { stakeNft } from 'actions/stake';
import { useToasts } from 'hooks/useToasts';

const NftCard = ({ mint, role, image, name, startLoading, stopLoading, updatePage }: StakingNftCardProps) => {
    const reward = roleRewards.find((rRole) => rRole.roles.includes(role));
    const rewardString = `${reward?.dailyReward} $COSMIC / DAY`;

    const wallet = useWallet();
    const { showErrorToast, showInfoToast } = useToasts();

    const onStake = async (mintAddress: string, roleTrait: string) => {
        if (wallet.publicKey === null) return;

        try {
            showInfoToast(`initializing staking process.`);
            await stakeNft(
                wallet,
                new PublicKey(mintAddress),
                15,
                roleTrait,
                1,
                () => startLoading(),
                () => stopLoading(),
                () => updatePage()
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <MainCard
                content={false}
                boxShadow
                sx={{
                    background: '#09080d',
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
                                N/A
                            </Typography>
                        </Typography>
                        {/* <Typography variant="h5" fontWeight="500">
                            Current Rewards:
                            <Typography component="span" variant="h4" fontWeight="700" sx={{ ml: '5px' }}>
                                0 $COSMIC
                            </Typography>
                        </Typography> */}
                    </Grid>

                    {/* Management Buttons */}
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button variant="contained" disabled fullWidth>
                                    Claim
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button onClick={() => onStake(mint, role)} variant="outlined" color="success" fullWidth>
                                    Stake
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Staking End Time */}
                    <Grid item xs={12} sx={{ mt: '8px', mb: '0px !important', textAlign: 'center' }}>
                        <Typography variant="caption">
                            Staking Penalty Ends:
                            <Typography component="span" variant="caption" fontWeight="700" sx={{ ml: '5px' }}>
                                N/A
                            </Typography>
                        </Typography>
                    </Grid>
                </CardContent>
            </MainCard>
        </>
    );
};

export default NftCard;
