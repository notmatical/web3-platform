import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';

// third party
import { motion } from 'framer-motion';

// project imports
import AnimateButton from 'components/@extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// prettier-ignore
const HeaderPage = () => {
    const theme = useTheme();

    return (
        <Container>
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={gridSpacing}
            >
                <Grid item xs={12} md={12} sx={{ mt: '40% !important' }}>
                    <Grid container sx={{ textAlign: 'center', justifyContent: 'center' }}>
                        <Grid>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 30
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '3.25rem', sm: '5rem', md: '8rem' },
                                        fontWeight: 900,
                                        lineHeight: 1.4
                                    }}
                                >
                                    <Box component="span" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textShadow: '5px 5px 10px rgb(18 23 47 / 65%)' }}>
                                        VAPORIZE FINANCE
                                    </Box>
                                </Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 30,
                                    delay: 0.2
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    component="div"
                                    sx={{
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                        fontWeight: 400,
                                        lineHeight: 1.4,
                                        color:
                                            theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.primary[200]
                                    }}
                                >
                                    Vaporize is a Web3 startup innovating and pushing the ecosystem forward while providing value to other startups.
                                </Typography>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} sx={{ my: 3.25 }}>
                            <motion.div
                                initial={{ opacity: 0, translateY: 550 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 150,
                                    damping: 30,
                                    delay: 0.4
                                }}
                            >
                                <Grid container spacing={5} sx={{ justifyContent: 'center' }}>
                                    <Grid item>
                                        <AnimateButton>
                                            <Button
                                                component={Link}
                                                href="#"
                                                size="large"
                                                variant="contained"
                                                color="secondary"
                                                sx={{ 
                                                    borderRadius: '24px',
                                                    '&:hover': {
                                                        transition: 'all .2s ease-in-out',
                                                        background: theme.palette.secondary.dark,
                                                        color: theme.palette.orange.light
                                                    }
                                                }}
                                            >
                                                Partnerships
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            component={RouterLink}
                                            to="/login"
                                            size="large"
                                            variant="contained"
                                            sx={{ 
                                                borderRadius: '24px',
                                                '&:hover': {
                                                    transition: 'all .2s ease-in-out',
                                                    background: theme.palette.primary.dark,
                                                    color: theme.palette.orange.light
                                                }
                                            }}
                                        >
                                            Holder Dashboard
                                        </Button>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HeaderPage;
