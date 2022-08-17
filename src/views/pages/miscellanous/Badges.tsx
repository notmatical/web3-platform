import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Avatar, Stack, Box, Button, Typography, Divider, IconButton, Skeleton, CircularProgress, Tooltip } from '@mui/material';

// project imports
import { abbreviateValue, formatPercent } from 'utils/utils';
import { gridSpacing } from 'store/constant';

// third-party
import axios from 'axios';

// assets
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import SolscanLogo from 'assets/images/icons/solscan.png';
import ExplorerLogo from 'assets/images/icons/explorer.png';

const Badges = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: '8px',
                        '&:hover': {
                            cursor: 'pointer',
                            color: theme.palette.primary.main,
                            transition: 'all .1s ease-in-out'
                        }
                    }}
                >
                    <IconButton size="small" color="primary">
                        <NavigateBeforeRoundedIcon />
                    </IconButton>
                    <Typography variant="h4" color="primary">
                        Go Back
                    </Typography>
                </Box>

                <Divider />
            </Grid>

            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                    Test
                </Typography>
            </Grid>
        </Grid>
    );
};

export default Badges;
