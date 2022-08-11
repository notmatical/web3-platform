import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, CardContent, CardMedia, Grid, Button, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Image from 'mui-image';

// web3
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// project imports
import MainCard from 'components/MainCard';
import { RewardCardProps } from 'types/raffles';
import { YAKU_DECIMALS } from 'config';

// third-party
import { getNFTDetail } from './fetchData';
import { DEFAULT_PAY_TYPE, RAFFLE_REWARD_TYPES, TOKEN_PAY_TYPE } from 'config/config';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import Loading from 'components/Loading';
import { useToasts } from 'hooks/useToasts';
import Countdown from 'components/Countdown';
import { each } from 'lodash';

const RaffleCarouselCard = ({
    ticketPriceToken,
    ticketPriceSol,
    endTimestamp,
    ticketsCount,
    nftMint,
    raffleKey,
    rewardType = 1,
    maxEntrants,
    isAdmin
}: RewardCardProps) => {
    const theme = useTheme();
    const wallet = useWallet();
    const navigate = useNavigate();

    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [family, setFamily] = useState('Not Specified');
    const [price, setPrice] = useState(0);
    const [payType, setPayType] = useState('--');
    const [loading, setLoading] = useState(false);

    const { showErrorToast, showInfoToast } = useToasts();
    const updatePage = async () => {
        try {
            setLoading(true);
            const item = await getNFTDetail({
                wallet,
                mint: nftMint,
                raffleKey
            });
            setImage(item.image);
            setName(item.name);
            setFamily(item.family);

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
                    border: `4px solid transparent !important`,
                    '&:hover': {
                        transition: 'all .2s ease-in-out',
                        border: `4px solid ${theme.palette.secondary.dark} !important`
                    }
                }}
                onClick={() => navigate(`/raffle/${raffleKey}`, { replace: true })}
            >
                <CardMedia sx={{ minHeight: 220, alignItems: 'center', display: 'flex' }}>
                    <Image src={image} alt={name} showLoading={<Loading />} />
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
                                <FormattedMessage id="raffle-ticket-remain" />
                            </Typography>
                            {maxEntrants - ticketsCount === 0 ? (
                                <Typography fontWeight="700" color="success.dark" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                    <FormattedMessage id="sold-out" />
                                </Typography>
                            ) : (
                                <Typography fontWeight="700" color="success" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                    {maxEntrants - ticketsCount} / {maxEntrants}
                                </Typography>
                            )}
                        </Stack>
                        <Stack sx={{ mr: 3 }}>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                <FormattedMessage id="price" />
                            </Typography>
                            <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                {price} {payType}
                            </Typography>
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
                </CardContent>
            </MainCard>
        </>
    );
};

export default RaffleCarouselCard;
