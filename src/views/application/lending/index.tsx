import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, TextField, MenuItem, Stack, Box, InputAdornment, OutlinedInput, Button, Typography } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'components/@extended/AnimateButton';
import CollabsPlaceholder from 'components/cards/Skeleton/CollabsPlaceholder';

// assets
import { IconSearch } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

const Lending = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [value, setValue] = useState('all');
    const [search, setSearch] = useState('test');

    const manage = () => {
        navigate('/collabs/manage', { replace: true });
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h6">Lend</Typography>
            </Grid>
        </Grid>
    );
};

export default Lending;
