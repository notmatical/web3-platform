import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Fade, Grid, Stack, Box, Avatar, Typography, Divider, Button, CircularProgress, CardMedia, Chip } from '@mui/material';

// web3 imports
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'components/MainCard';

// graphql
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../graphql/graphql';

// assets
import { IconBook } from '@tabler/icons';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Quests = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const wallet = useWallet();

    const { data, loading, error } = useQuery(queries.GET_QUESTS, { fetchPolicy: 'network-only' });

    console.log(data);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center" sx={{ mb: 3 }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.largeAvatar,
                            borderRadius: '9999px',
                            backgroundColor: theme.palette.dark.main,
                            color: theme.palette.secondary.dark,
                            mr: 1
                        }}
                    >
                        <IconBook size="1.2rem" />
                    </Avatar>
                    <Stack>
                        <Typography variant="h3">Quests</Typography>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            sx={{
                                transition: 'all .15s ease',
                                '&:hover': {
                                    cursor: 'pointer',
                                    opacity: '.8',
                                    transition: 'all .15s ease'
                                }
                            }}
                        >
                            <Typography
                                variant="inherit"
                                color="secondary.dark"
                                fontWeight="600"
                                sx={{ fontSize: '10px', textTransform: 'uppercase' }}
                            >
                                Learn More
                            </Typography>
                            <ArrowForwardIcon
                                fontSize="inherit"
                                style={{
                                    color: theme.palette.secondary.dark,
                                    marginLeft: 2
                                }}
                            />
                        </Box>
                    </Stack>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {wallet.connected && (
                    <Box
                        display="flex"
                        justifyContent="flex-start"
                        sx={{
                            borderRadius: 3,
                            padding: 3,
                            background: theme.palette.background.paper,
                            border: '1px solid rgba(213, 217, 233, 0.2)'
                        }}
                    >
                        <Stack alignItems="flex-start">
                            <Typography variant="h4" color="inherit">
                                Wallet not connected
                            </Typography>
                            <Typography variant="caption" color="inherit">
                                There are no NFTs that you have unstaked to upgrade.
                            </Typography>
                            <Button color="secondary" size="small" variant="contained" sx={{ borderRadius: '16px', mt: 1 }}>
                                Connect
                            </Button>
                        </Stack>
                    </Box>
                )}
            </Grid>

            {data && data.quests && data.quests.length > 0 ? (
                <>
                    {data.quests.map((quest: any, index: number) => (
                        <Grid key={index} item xs={4}>
                            <MainCard boxShadow content={false}>
                                <Box sx={{ height: 110 }}>
                                    {/* Quest Type */}
                                    <Box
                                        display="flex"
                                        alignItems="flex-start"
                                        justifyContent="space-between"
                                        sx={{
                                            position: 'absolute',
                                            p: '12px',
                                            width: 'calc(100% - 24px)',
                                            height: 'calc(100% - 24px)',
                                            zIndex: 1
                                        }}
                                    >
                                        {quest.cooldownDays === 0 && (
                                            <Chip
                                                label="one-time"
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    borderRadius: 1,
                                                    background: '#202a30',
                                                    '&:hover': {
                                                        cursor: 'pointer'
                                                    },
                                                    '& .MuiChip-label': {
                                                        textTransform: 'uppercase',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            />
                                        )}
                                        {quest.cooldownDays === 1 && (
                                            <Chip
                                                label="daily"
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    borderRadius: 1,
                                                    background: '#202a30',
                                                    '&:hover': {
                                                        cursor: 'pointer'
                                                    },
                                                    '& .MuiChip-label': {
                                                        textTransform: 'uppercase',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            />
                                        )}
                                        {quest.cooldownDays === 7 && (
                                            <Chip
                                                label="weekly"
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    borderRadius: 1,
                                                    background: '#202a30',
                                                    '&:hover': {
                                                        cursor: 'pointer'
                                                    },
                                                    '& .MuiChip-label': {
                                                        textTransform: 'uppercase',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Fade in timeout={500} unmountOnExit>
                                        <CardMedia
                                            image="https://storage.googleapis.com/zapper-fi-assets/quests/7.png"
                                            sx={{ height: 110 }}
                                        />
                                    </Fade>

                                    {/* Quest Title */}
                                    <Box
                                        display="flex"
                                        alignItems="flex-end"
                                        justifyContent="flex-start"
                                        sx={{
                                            position: 'absolute',
                                            p: '12px',
                                            width: 'calc(100% - 24px)',
                                            height: 'calc(100% - 24px)',
                                            bottom: 0,
                                            background: 'linear-gradient(0deg, #141a1e, rgba(20,26,30,0))'
                                        }}
                                    >
                                        <Typography variant="h4" color="inherit" sx={{ zIndex: 50 }}>
                                            {quest.name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </MainCard>
                        </Grid>
                    ))}
                </>
            ) : (
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress color="secondary" />
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default Quests;
