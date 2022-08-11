import { Box, CardContent, CardMedia, Grid, Button, Typography, Divider } from '@mui/material';
import { Image } from 'mui-image';
import HashLoader from 'react-spinners/HashLoader';

// web3
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// project imports
import MainCard from 'components/MainCard';
import Chip from 'components/@extended/Chip';
import { YakuStakingNftCardProps } from 'types/staking';
import { loadYakuProgram, stakeYakuNft } from 'actions/yakuStake';
import { useToasts } from 'hooks/useToasts';
import { solConnection } from 'actions/shared';
import { YAKU_TOKEN_ICON } from 'config/config';
import { FormattedMessage } from 'react-intl';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/CardPlaceholder';

const NftCard = ({ mint, image, name, reward, traits, startLoading, stopLoading, updatePage }: YakuStakingNftCardProps) => {
    const rewardString = (+reward / LAMPORTS_PER_SOL).toFixed(2);
    const wallet: any = useAnchorWallet();
    const { showInfoToast, showErrorToast } = useToasts();

    const onStake = async (mintAddress: string) => {
        if (wallet.publicKey === null) return;

        try {
            startLoading();
            const program = await loadYakuProgram(solConnection, wallet);
            await stakeYakuNft(program, wallet, new PublicKey(mintAddress));
            showInfoToast('You have successfully staked your NFT.');
            updatePage();
        } catch (error: any) {
            showErrorToast('An error has occured while staking your nft, please try again.');
            console.error(error);
        } finally {
            stopLoading();
        }
    };

    return (
        <>
            {name ? (
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
                    <CardMedia sx={{ minHeight: 200, display: 'flex', alignItems: 'center' }}>
                        <Image src={image} alt={name} showLoading={<HashLoader size={32} color="#c300ff" />} />
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
                        <Grid item xs={12} sx={{ mb: '10px', mt: '5px' }}>
                            <FormattedMessage id="per-day">
                                {(msg) => (
                                    <Chip
                                        icon={<img src={YAKU_TOKEN_ICON} alt="" style={{ width: 16, borderRadius: 5000 }} />}
                                        label={`${rewardString} ${msg}`}
                                        size="small"
                                        color="secondary"
                                    />
                                )}
                            </FormattedMessage>
                        </Grid>

                        <Divider sx={{ mb: '10px' }} />

                        {/* Management Buttons */}
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Button variant="contained" disabled fullWidth>
                                        <FormattedMessage id="claim" />
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button onClick={() => onStake(mint)} variant="outlined" color="secondary" fullWidth>
                                        <FormattedMessage id="stake" />
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

export default NftCard;
