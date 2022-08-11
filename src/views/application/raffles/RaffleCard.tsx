import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, CardContent, CardMedia, Grid, Button, Typography, Chip } from '@mui/material';
import Image from 'mui-image';

// web3
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// project imports
import MainCard from 'components/MainCard';
import { YAKU_DECIMALS } from 'config';
import { DEFAULT_PAY_TYPE, RAFFLE_REWARD_TYPES, TOKEN_PAY_TYPE } from 'config/config';
import Loading from 'components/Loading';
import { useToasts } from 'hooks/useToasts';
import { RewardCardProps } from 'types/raffles';

// third-party
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import Countdown from 'components/Countdown';
import { each } from 'lodash';

const RaffleCard = ({
    ticketPriceToken,
    ticketPriceSol,
    endTimestamp,
    ticketsCount,
    nftMint,
    raffleKey,
    maxEntrants,
    image,
    name,
    description,
    rewardType = 1,
    family,
    isAdmin
}: RewardCardProps) => {
    const wallet = useWallet();
    const navigate = useNavigate();
    const [price, setPrice] = useState(0);
    const [payType, setPayType] = useState('--');
    const [loading, setLoading] = useState(false);

    const { showErrorToast, showInfoToast } = useToasts();
    const updatePage = async () => {
        try {
            setLoading(true);

            if (ticketPriceToken === 0) {
                setPrice(ticketPriceSol / LAMPORTS_PER_SOL);
                setPayType(DEFAULT_PAY_TYPE);
            } else if (ticketPriceSol === 0) {
                setPrice(ticketPriceToken / YAKU_DECIMALS);
                setPayType(TOKEN_PAY_TYPE);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRewardTypeLabel = (rwType: number) => {
        let rewardTypeKey = 'nft';
        each(Object.keys(RAFFLE_REWARD_TYPES), (key) => {
            if (RAFFLE_REWARD_TYPES[key] === rwType) {
                rewardTypeKey = key;
                return false;
            }
            return true;
        });
        const labelMapping: Record<string, string> = {
            nft: 'NFT',
            whitelist: 'WL',
            spl: TOKEN_PAY_TYPE
        };
        return labelMapping[rewardTypeKey];
    };
    const rewardChipColor: Array<'default' | 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success'> = [
        'primary',
        'secondary',
        'info'
    ];
    useEffect(() => {
        updatePage();
    }, [wallet.connected]);

    return (
        <>
            <MainCard
                content={false}
                border={false}
                boxShadow
                sx={{
                    '&:hover': {
                        transform: 'scale3d(1.07, 1.07, 1)',
                        transition: '.15s'
                    }
                }}
                onClick={() => navigate(`/raffle/${raffleKey}`, { replace: true })}
            >
                <CardMedia sx={{ minHeight: 220, alignItems: 'center', display: 'flex' }}>
                    <Image src={image || ''} alt={name} showLoading={<Loading />} />
                </CardMedia>
                <CardContent sx={{ p: 2, pb: '16px !important' }}>
                    {/* collection family */}
                    <Box display="flex" sx={{ justifyContent: 'space-between' }}>
                        <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                            {family}
                        </Typography>
                        <Chip label={getRewardTypeLabel(rewardType)} color={rewardChipColor[rewardType] || 'primary'} />
                    </Box>

                    {/* name */}
                    <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                        {name}
                    </Typography>

                    {/* tickets remaining / price per ticket */}
                    <Box display="flex" justifyContent="space-between">
                        <Stack sx={{ mr: 3 }}>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                <FormattedMessage id="price" />
                            </Typography>
                            <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                {price} {payType}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                <FormattedMessage id="raffle-ticket-remain" />
                            </Typography>
                            {maxEntrants - ticketsCount === 0 ? (
                                <Typography fontWeight="700" color="success.dark" sx={{ fontSize: '1.25rem', pb: '4px', textAlign: 'end' }}>
                                    <FormattedMessage id="sold-out" />
                                </Typography>
                            ) : (
                                <Typography fontWeight="700" color="success" sx={{ fontSize: '1.25rem', pb: '4px', textAlign: 'end' }}>
                                    {maxEntrants - ticketsCount} / {maxEntrants}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Box display="flex" justifyContent="flex-end" sx={{ pb: 2 }}>
                        <Stack>
                            <Typography fontWeight="700" sx={{ fontSize: '1rem' }}>
                                <Countdown
                                    endDateTime={new Date(endTimestamp)}
                                    renderer={({ days, hours, minutes, seconds, completed }: any) => {
                                        if (completed) {
                                            // Render a completed state
                                            return <FormattedMessage id="closed" />;
                                        }
                                        // Render a countdown
                                        return (
                                            <span>
                                                <FormattedMessage id="end-in" /> {days} <FormattedMessage id="days" /> {hours}{' '}
                                                <FormattedMessage id="hrs" /> {minutes} <FormattedMessage id="mins" /> {seconds}{' '}
                                                <FormattedMessage id="secs" />
                                            </span>
                                        );
                                    }}
                                />
                            </Typography>
                        </Stack>
                    </Box>
                    {/* Management Buttons */}
                    <Grid item xs={12}>
                        {moment() > moment(endTimestamp) ? (
                            <Button variant="outlined" color="primary" sx={{ borderRadius: 3 }} fullWidth>
                                <FormattedMessage id="view-raffle" />
                            </Button>
                        ) : (
                            <Button variant="outlined" color="secondary" sx={{ borderRadius: 3 }} fullWidth>
                                <FormattedMessage id="view-raffle" />
                            </Button>
                        )}
                    </Grid>
                </CardContent>
            </MainCard>
        </>
    );
};

export default RaffleCard;
