// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Container, Grid, Typography, Button } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import imgAmbassador from 'assets/images/landing/ambassador2.png';
import Background from 'assets/images/landing/bg2.jpg';

// styles
const AmbassadorWrapper = styled('div')(({ theme }) => ({
    padding: '100px 0',
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',

    [theme.breakpoints.down('lg')]: {
        padding: '50px 0',
        backgroundImage: `url(${Background})`,
        backgroundSize: 'cover'
    }
}));

const AmbassadorCard = styled('div')(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? '#030614' : '#FFFFFF',
    boxShadow: '0px 0px 60px rgba(0, 0, 0, 1)',
    borderRadius: '20px',
    padding: '65px 75px',
    [theme.breakpoints.down('md')]: {
        padding: '40px 25px'
    }
}));

const AmbassadorImage = styled('img')({
    width: 330,
    animation: '5s wings ease-in-out infinite',
    maxWidth: '100%'
});

const AmbassadorPage = () => {
    const theme = useTheme();

    return (
        <AmbassadorWrapper>
            <Container>
                <Grid container alignItems="center" spacing={gridSpacing}>
                    <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                            textAlign: 'right',
                            [theme.breakpoints.down('lg')]: { textAlign: 'center' }
                        }}
                    >
                        <AmbassadorImage src={imgAmbassador} alt="Yaku Labs" />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <AmbassadorCard>
                            <Grid container spacing={gridSpacing} sx={{ mb: '1rem' }}>
                                <Grid item sm={12}>
                                    <Typography
                                        variant="h1"
                                        component="div"
                                        sx={{ [theme.breakpoints.down('md')]: { fontSize: '1.125rem' } }}
                                    >
                                        Ambassador Program
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <Typography variant="body2">
                                        Want to aide in the growth of the Vaporize Finance Brand and earn $SOL each time you successfully
                                        refer a project?
                                        <br />
                                        <br />
                                        Send us a message on Discord to get started.
                                    </Typography>
                                </Grid>
                                <Grid item sm={12}>
                                    <Button
                                        href="https://discord.gg/a2KD752SA8"
                                        target="_blank"
                                        variant="contained"
                                        color="secondary"
                                        disableElevation
                                    >
                                        Become an Ambassador
                                    </Button>
                                </Grid>
                            </Grid>
                        </AmbassadorCard>
                    </Grid>
                </Grid>
            </Container>
        </AmbassadorWrapper>
    );
};

export default AmbassadorPage;
