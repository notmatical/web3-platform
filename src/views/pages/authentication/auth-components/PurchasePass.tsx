import { Link } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Divider, Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper from '../AuthWrapper';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthFooter from 'components/cards/AuthFooter';
import useConfig from 'hooks/useConfig';
import { useToasts } from 'hooks/useToasts';
import { useMeta } from 'contexts/meta/meta';

// assets
import logoDark from 'assets/images/vapor-logo-light.png';
import logo from 'assets/images/vapor-logo-dark.png';
import MagicEdenLogo from 'assets/images/icons/me-logo.png';
import SolPortLogo from 'assets/images/icons/solport.svg';
import OpenSeaLogo from 'assets/images/icons/opensea.svg';

const MarketButton = styled(Button)({
    gap: '5px'
});

const PurchasePass = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const { showInfoToast } = useToasts();
    const { startLoading, stopLoading } = useMeta();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const sendMarketplace = (mp: string) => {
        switch (mp) {
            case 'magic':
                showInfoToast('You will be redirected in 3 seconds to Magic Eden');
                startLoading();
                setTimeout(() => {
                    stopLoading();
                    window.location.href = 'https://magiceden.io/marketplace/cosmic_astronauts';
                }, 3000);
                break;

            case 'solport':
                showInfoToast('You will be redirected in 3 seconds to Solport');
                startLoading();
                setTimeout(() => {
                    stopLoading();
                    window.location.href = 'https://solport.io/collection/cosmicastronauts';
                }, 3000);
                break;

            default:
                showInfoToast('You will be redirected in 3 seconds to Magic Eden');
                startLoading();
                setTimeout(() => {
                    stopLoading();
                    window.location.href = 'https://magiceden.io/marketplace/cosmic_astronauts';
                }, 3000);
                break;
        }
    };

    return (
        <AuthWrapper>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item>
                                        <Link to="#">
                                            <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Vaporize" width="200" />
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
                                                    <Typography variant="caption" fontSize="16px" textAlign="center">
                                                        It appears your wallet does not have proper access to the Vaporize Dashboard
                                                        <br />
                                                        <br />
                                                        You can purchase one on any of the secondary marketplaces below.
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item xs={12}>
                                            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        cursor: 'unset',
                                                        m: 2,
                                                        py: 0.5,
                                                        px: 7,
                                                        borderColor:
                                                            theme.palette.mode === 'dark'
                                                                ? `${theme.palette.dark.light + 20} !important`
                                                                : `${theme.palette.grey[100]} !important`,
                                                        color: `${theme.palette.grey[900]}!important`,
                                                        fontWeight: 500,
                                                        borderRadius: `${borderRadius}px`
                                                    }}
                                                    disableRipple
                                                    disabled
                                                >
                                                    SOLANA
                                                </Button>

                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                            </Box>
                                        </Grid>

                                        <MarketButton
                                            sx={{ mb: 1 }}
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={() => sendMarketplace('magic')}
                                        >
                                            <img src={MagicEdenLogo} alt="Magic Eden" width={24} height={24} />
                                            Magic Eden
                                        </MarketButton>

                                        <MarketButton
                                            sx={{ mb: 1 }}
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={() => sendMarketplace('solport')}
                                        >
                                            <img src={SolPortLogo} alt="SolPort" width={24} height={24} />
                                            Solport
                                        </MarketButton>

                                        {/* <MarketButton sx={{ mb: 1 }} variant="contained" color="secondary" fullWidth>
                                            <img src={SolanartLogo} alt="SolPort" width={24} height={24} />
                                            Solanart
                                        </MarketButton>

                                        <MarketButton sx={{ mb: 1 }} variant="contained" color="secondary" fullWidth>
                                            <img src={HyperspaceLogo} alt="SolPort" width={24} height={24} />
                                            Hyperspace
                                        </MarketButton> */}

                                        {/* ETH WALLETS */}
                                        <Grid item xs={12}>
                                            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                                                <Button
                                                    variant="outlined"
                                                    sx={{
                                                        cursor: 'unset',
                                                        m: 2,
                                                        py: 0.5,
                                                        px: 7,
                                                        borderColor:
                                                            theme.palette.mode === 'dark'
                                                                ? `${theme.palette.dark.light + 20} !important`
                                                                : `${theme.palette.grey[100]} !important`,
                                                        color: `${theme.palette.grey[900]}!important`,
                                                        fontWeight: 500,
                                                        borderRadius: `${borderRadius}px`
                                                    }}
                                                    disableRipple
                                                    disabled
                                                >
                                                    ETHEREUM
                                                </Button>

                                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                            </Box>
                                        </Grid>

                                        <MarketButton variant="contained" color="secondary" fullWidth>
                                            <img src={OpenSeaLogo} alt="OpenSea" width={24} height={24} />
                                            OpenSea
                                        </MarketButton>
                                        {/* <AuthLogin /> */}
                                    </Grid>
                                </Grid>
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

export default PurchasePass;
