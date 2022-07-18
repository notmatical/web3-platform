import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography, useMediaQuery, Avatar } from '@mui/material';

// web3
import { useWallet } from '@solana/wallet-adapter-react';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthFooter from 'components/cards/AuthFooter';

// assets
import logoDark from 'assets/images/logo-light.png';
import logo from 'assets/images/logo-dark.png';
import { IconCheck } from '@tabler/icons';

const LinkDiscord = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { publicKey } = useWallet();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [hasLinked, setHasLinked] = useState(false);

    const handleDiscord = () => {
        if (publicKey) {
            window.location.href = `http://localhost:8080/api/v1/auth/${publicKey?.toBase58()}`;
        }

        navigate('/login', { replace: true });
    };

    return (
        <AuthWrapper>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                {hasLinked ? (
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <Avatar sx={{ width: 128, height: 128, bgcolor: theme.palette.success.main }}>
                                                <IconCheck size={120} color={theme.palette.mode === 'dark' ? '#12172f' : '#FFFFFF'} />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                direction={matchDownSM ? 'column-reverse' : 'row'}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                        <Typography variant="h3" textAlign="center">
                                                            Discord Linked!
                                                        </Typography>
                                                        <Typography variant="caption" fontSize="15px" textAlign="center">
                                                            Your Discord has been successfully linked, you will be redirected shortly.
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <Link to="#">
                                                <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Yaku Labs" width="200" />
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                direction={matchDownSM ? 'column-reverse' : 'row'}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                        <Typography variant="h3" textAlign="center">
                                                            Discord Verification
                                                        </Typography>
                                                        <Typography variant="caption" fontSize="15px" textAlign="center">
                                                            With a Discord linked, you can experience a far better user experience. Alert,
                                                            Staking, and Evolution notifications and not to mention much more!
                                                            <br />
                                                            <br />
                                                            You can use the button below to begin the linking process.
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDiscord();
                                                }}
                                                sx={{ mb: 1, mt: 1 }}
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                            >
                                                Link My Discord
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
};

export default LinkDiscord;
