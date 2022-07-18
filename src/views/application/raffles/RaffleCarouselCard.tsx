import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, CardContent, CardMedia, Grid, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// web3
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

// project imports
import MainCard from 'components/MainCard';
import { RewardCardProps } from 'types/staking';
import { useToasts } from 'hooks/useToasts';
import { getNftMetaData } from 'actions/shared';
import { DECIMALS } from 'config';

// third-party
import axios from 'axios';
import moment from 'moment';
import Countdown from 'react-countdown';

const RaffleCarouselCard = ({
    ticketPriceCosmic,
    ticketPriceSol,
    endTimestamp,
    ticketsCount,
    nftMint,
    raffleKey,
    maxEntrants
}: RewardCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [family, setFamily] = useState('Not Specified');
    const [price, setPrice] = useState(0);
    const [payType, setPayType] = useState('--');
    const [loading, setLoading] = useState(false);

    const { showErrorToast, showInfoToast } = useToasts();

    const getNftDetail = async () => {
        setLoading(true);
        const uri = await getNftMetaData(new PublicKey(nftMint));
        await axios
            .get(uri)
            .then((res) => {
                setImage(res.data.image);
                setName(res.data.name);
                setFamily(res.data.collection.name);
            })
            .catch((error) => {
                console.log(error);
            });

        if (ticketPriceCosmic === 0) {
            setPrice(ticketPriceSol / LAMPORTS_PER_SOL);
            setPayType('SOL');
        } else if (ticketPriceSol === 0) {
            setPrice(ticketPriceCosmic / DECIMALS);
            setPayType('COSMIC');
        }

        setLoading(false);
    };

    useEffect(() => {
        getNftDetail();
    }, []);

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
                <CardMedia sx={{ height: 250 }} image={image} title={name} />
                <CardContent sx={{ p: 2, pb: '16px !important' }}>
                    {/* collection family */}
                    <Box display="flex">
                        <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                            {family}
                        </Typography>
                    </Box>

                    {/* name */}
                    <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                        {name}
                    </Typography>

                    {/* tickets remaining / price per ticket */}
                    <Box display="flex" justifyContent="space-between">
                        <Stack sx={{ mr: 3 }}>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                Tickets Remaining
                            </Typography>
                            {maxEntrants - ticketsCount === 0 ? (
                                <Typography fontWeight="700" color="success.dark" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                    SOLD OUT
                                </Typography>
                            ) : (
                                <Typography fontWeight="700" color="success" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                    {maxEntrants - ticketsCount} / {maxEntrants}
                                </Typography>
                            )}
                        </Stack>
                        <Stack sx={{ mr: 3 }}>
                            <Typography fontWeight="700" color="secondary.dark" sx={{ fontSize: '.875rem' }}>
                                Price/Ticket
                            </Typography>
                            <Typography fontWeight="700" color="inherit" sx={{ fontSize: '1.25rem', pb: '4px' }}>
                                {price} {payType}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Management Buttons */}
                    <Grid item xs={12}>
                        {moment() > moment(endTimestamp) ? (
                            <Button variant="outlined" color="primary" sx={{ borderRadius: 3 }} fullWidth>
                                View Raffle
                            </Button>
                        ) : (
                            <Button variant="outlined" color="secondary" sx={{ borderRadius: 3 }} fullWidth>
                                View Raffle
                            </Button>
                        )}
                    </Grid>
                </CardContent>
            </MainCard>
        </>
    );
};

export default RaffleCarouselCard;
