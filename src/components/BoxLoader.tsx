import { FC, useState } from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Typography, Dialog, DialogContent, CircularProgress } from '@mui/material';

// project imports
import { useMeta } from 'contexts/meta/meta';

// spinner
import HashLoader from 'react-spinners/HashLoader';
import YakuLoader from 'assets/images/x-loader.gif';

// styles
const LoaderWrapper = styled('div')({
    display: 'flex',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100vh',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(9, 8, 13, 0.6)'
});

const LoaderBox = styled('div')({
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 20px 5px rgba(0, 0, 0, 0.7)',
    background: '#030614'
});

// ==============================|| BOX LOADER ||============================== //

export const LoaderProvider: FC = ({ children }) => {
    const { isLoading } = useMeta();

    return (
        <>
            {isLoading && <BoxLoader />}
            {children}
        </>
    );
};

const BoxLoader = () => (
    <LoaderWrapper>
        <HashLoader size={32} color="#c691c1" />
        {/* <img src={YakuLoader} alt="loader" /> */}
    </LoaderWrapper>
);

export default BoxLoader;
