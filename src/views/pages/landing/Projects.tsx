// material-ui
import { Link, ButtonBase, Container, Grid, Typography } from '@mui/material';

// project imports
import FadeInWhenVisible from './Animation';
import { gridSpacing } from 'store/constant';

// assets
import cas from 'assets/images/landing/cosmic-astro.gif';
import soon from 'assets/images/landing/soon.png';

const imageStyle = {
    width: '100%',
    borderRadius: '12px'
};

const ProjectsPage = () => (
    <Container sx={{ paddingBottom: '160px' }}>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={5} md={10}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Typography variant="h5" color="primary">
                                    Our Projects
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h2" component="div">
                            Vaporize Projects &#38; Acquisitions
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            Vaporize looks to push the space forward by acquiring and giving commerical rights back to the end-user.
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={gridSpacing} sx={{ textAlign: 'center' }}>
                    <Grid item md={4} sm={6}>
                        <FadeInWhenVisible>
                            <ButtonBase component={Link} href="https://cosmicastronauts.com">
                                <img src={cas} alt="Cosmic Astronauts" style={imageStyle} />
                            </ButtonBase>
                        </FadeInWhenVisible>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <FadeInWhenVisible>
                            <ButtonBase component={Link} href="#">
                                <img src={soon} alt="Coming Soon" style={imageStyle} />
                            </ButtonBase>
                        </FadeInWhenVisible>
                    </Grid>
                    <Grid item md={4} sm={6}>
                        <FadeInWhenVisible>
                            <ButtonBase component={Link} href="#">
                                <img src={soon} alt="Coming Soon" style={imageStyle} />
                            </ButtonBase>
                        </FadeInWhenVisible>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Container>
);

export default ProjectsPage;
