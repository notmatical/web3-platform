import React from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Button, Typography } from '@mui/material';

// project imports
import { formatUSD } from 'utils/utils';
import { useEthPrice, useSolPrice } from 'contexts/CoinGecko';
import MainCard from 'components/cards/MainCard';
import SkeletonEarningCard from 'components/cards/Skeleton/EarningCard';

// third party
import CountUp from 'react-countup';

// assets
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background:
            theme.palette.mode === 'dark'
                ? `linear-gradient(210.04deg, ${theme.palette.primary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                : theme.palette.primary[800],
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        width: 210,
        height: 210,
        background:
            theme.palette.mode === 'dark'
                ? `linear-gradient(140.9deg, ${theme.palette.primary.dark} -14.02%, rgba(144, 202, 249, 0) 82.50%)`
                : theme.palette.primary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

interface EarningCardProps {
    isLoading: boolean;
}

const PriceCard = ({ isLoading }: EarningCardProps) => {
    const theme = useTheme();

    const [displayPrice, setDisplayPrice] = React.useState<boolean>(true);
    const handleChangePrice = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newValue: boolean) => {
        setDisplayPrice(newValue);
    };

    const solPrice = useSolPrice();
    const ethPrice = useEthPrice();

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor:
                                                    theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary[800],
                                                color:
                                                    theme.palette.mode === 'dark' ? theme.palette.success.dark : theme.palette.success.dark,
                                                mt: 1
                                            }}
                                        >
                                            <AttachMoneyIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            disableElevation
                                            variant={displayPrice ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit' }}
                                            onClick={(e) => handleChangePrice(e, true)}
                                        >
                                            Solana
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={!displayPrice ? 'contained' : 'text'}
                                            size="small"
                                            sx={{ color: 'inherit' }}
                                            onClick={(e) => handleChangePrice(e, false)}
                                        >
                                            Ethereum
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        {displayPrice ? (
                                            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                <CountUp end={solPrice} decimals={2} />
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                                <CountUp end={ethPrice} decimals={2} />
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                ...theme.typography.smallAvatar,
                                                backgroundColor: theme.palette.primary.main,
                                                color: theme.palette.info.main
                                            }}
                                        >
                                            <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                {displayPrice ? (
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color:
                                                theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.secondary[200]
                                        }}
                                    >
                                        Current Solana Price
                                    </Typography>
                                ) : (
                                    <Typography
                                        sx={{
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            color:
                                                theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.secondary[200]
                                        }}
                                    >
                                        Current Ethereum Price
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

export default PriceCard;
