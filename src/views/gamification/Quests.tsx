import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Stack, Box, Avatar, Typography } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'components/@extended/AnimateButton';
import CollabsPlaceholder from 'components/cards/Skeleton/CollabsPlaceholder';

// assets
import { IconSearch } from '@tabler/icons';
import DefaultUser from 'assets/images/users/user-image.jpg';

const Quests = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <Avatar
                        src={DefaultUser}
                        color="inherit"
                        sx={{
                            ...theme.typography.largeAvatar,
                            mr: 1,
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}
                    />
                    <Stack>
                        <Typography variant="h3">Quests</Typography>
                        <Typography variant="subtitle1">Learn More</Typography>
                    </Stack>
                </Box>
                {/*  */}
            </Grid>
        </Grid>
    );
};

export default Quests;
