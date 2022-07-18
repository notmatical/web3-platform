import React, { useEffect, useState, ReactElement } from 'react';

// material-ui
import { Button, Dialog, Grid } from '@mui/material';

// project imports
import { useToasts } from 'hooks/useToasts';
import { gridSpacing } from 'store/constant';
import MainCard from 'components/cards/MainCard';

const Sniper = () => {
    const { showInfoToast } = useToasts();

    return (
        <MainCard title="Collections">
            <Grid container spacing={gridSpacing}>
                <h1>test</h1>
            </Grid>
        </MainCard>
    );
};

export default Sniper;
