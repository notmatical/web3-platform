// material-ui
import { styled } from '@mui/material/styles';

// project imports
import Header from './Header';
import Services from './Services';
import Ambassador from './Ambassador';
import Projects from './Projects';
import Footer from './Footer';
import AppBar from 'components/@extended/AppBar';

// assets
import Background from 'assets/images/landing/bg2.jpg';

const HeaderWrapper = styled('div')(({ theme }) => ({
    paddingTop: 30,
    height: '100vh',
    overflowX: 'hidden',
    overflowY: 'clip',
    backgroundImage: `url(${Background})`,
    backgroundSize: 'cover',
    [theme.breakpoints.down('md')]: {
        paddingTop: 42
    }
}));

const SecondWrapper = styled('div')(({ theme }) => ({
    paddingTop: 160,
    [theme.breakpoints.down('md')]: {
        paddingTop: 60
    }
}));

const Homepage = () => (
    <>
        <HeaderWrapper id="home">
            <AppBar />
            <Header />
        </HeaderWrapper>
        <SecondWrapper id="services">
            <Services />
        </SecondWrapper>
        <SecondWrapper>
            <Ambassador />
        </SecondWrapper>
        <SecondWrapper id="projects">
            <Projects />
        </SecondWrapper>
        <Footer />
    </>
);

export default Homepage;
