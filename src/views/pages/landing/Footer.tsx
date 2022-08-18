// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Container, Grid, Link } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// assets
import TwitterIcon from '@mui/icons-material/Twitter';
import logoDark from 'assets/images/vapor-logo-dark.png';

// styles
const FooterWrapper = styled('div')(({ theme }) => ({
    padding: '35px 0',
    color: '#fff',
    background: theme.palette.secondary.main,
    [theme.breakpoints.down('md')]: {
        textAlign: 'center'
    }
}));

const FooterLink = styled(Link)({
    color: '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none !important',
    opacity: '0.8',
    '& svg': {
        fontsize: '1.125rem',
        marginRight: 8
    },
    '&:hover': {
        opacity: '1'
    }
});

const FooterPage = () => {
    const theme = useTheme();
    return (
        <>
            <FooterWrapper>
                <Container>
                    <Grid container alignItems="center" spacing={gridSpacing}>
                        <Grid item xs={12} sm={4}>
                            <img src={logoDark} alt="Vaporize" width="100" />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Grid
                                container
                                alignItems="center"
                                spacing={2}
                                sx={{ justifyContent: 'flex-end', [theme.breakpoints.down('md')]: { justifyContent: 'center' } }}
                            >
                                <Grid item>
                                    <FooterLink href="https://twitter.com/vaporize_fi" target="_blank" underline="hover">
                                        <TwitterIcon />
                                        Twitter
                                    </FooterLink>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </FooterWrapper>
        </>
    );
};

export default FooterPage;
