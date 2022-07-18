// material-ui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Typography } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';
import SubCard from 'components/cards/SubCard';
import Avatar from 'components/@extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const ServicesPage = () => {
    const theme = useTheme();
    return (
        <Container>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={5} md={10}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Typography variant="h5" color="primary">
                                        Our Services
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h2" component="div">
                                Looking to add value to your project?
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2">
                                Yaku Labs offers a variety of innovating services to add value to any project looking to expand in the
                                ecosystem.
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: 'center' }}>
                        <Grid item md={4} sm={6}>
                            <FadeInWhenVisible>
                                <SubCard>
                                    <Grid container justifyContent="center" spacing={2}>
                                        <Grid item>
                                            <Avatar
                                                size="xl"
                                                variant="rounded"
                                                sx={{
                                                    background:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.dark[900]
                                                            : theme.palette.secondary.light,
                                                    color: theme.palette.secondary.main
                                                }}
                                            >
                                                <RocketLaunchIcon fontSize="large" />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h3">Holder Dashboard</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                Gain access to our state of the art Holder Dashboard, enabling cross-chain information that
                                                has never been seen before.
                                            </Typography>
                                            <Typography variant="body2" sx={{ paddingTop: 1 }}>
                                                Cross-chain Analytical Data, Mint Calendar, Rarity Lookup, Price Alerts, Governance,
                                                Auctions and Lotteries.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item md={4} sm={6}>
                            <FadeInWhenVisible>
                                <SubCard>
                                    <Grid container justifyContent="center" spacing={2}>
                                        <Grid item>
                                            <Avatar
                                                size="xl"
                                                variant="rounded"
                                                sx={{
                                                    background:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.dark[900]
                                                            : theme.palette.secondary.light,
                                                    color: theme.palette.secondary.main
                                                }}
                                            >
                                                <StarIcon fontSize="large" />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h3">Technology Utilities</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                A completely secure technology platform that enables powerful utilities for your project.
                                            </Typography>
                                            <Typography variant="body2" sx={{ paddingTop: 1 }}>
                                                Obtain an array of smart contract features to use at your disposal. Staking, Evolution,
                                                Breeding, Raffles/Auctions and many more to come.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </FadeInWhenVisible>
                        </Grid>
                        <Grid item md={4} sm={6}>
                            <FadeInWhenVisible>
                                <SubCard>
                                    <Grid container justifyContent="center" spacing={2}>
                                        <Grid item>
                                            <Avatar
                                                size="xl"
                                                variant="rounded"
                                                sx={{
                                                    background:
                                                        theme.palette.mode === 'dark'
                                                            ? theme.palette.dark[900]
                                                            : theme.palette.secondary.light,
                                                    color: theme.palette.secondary.main
                                                }}
                                            >
                                                <AutoAwesomeIcon fontSize="large" />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h3">Strategy Consultation</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body2">
                                                Gain access to industry connections that can bootstrap your project, and turn it into a
                                                reality.
                                            </Typography>
                                            <Typography variant="body2" sx={{ paddingTop: 1 }}>
                                                Have artists, developers, tokenomic experts, graphical designers and marketing advisors at
                                                your fingertips.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </SubCard>
                            </FadeInWhenVisible>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ServicesPage;
