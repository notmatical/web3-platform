import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Divider, Grid, IconButton, Link, TextField, Typography } from '@mui/material';

// project imports
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import PublicTwoToneIcon from '@mui/icons-material/PublicTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';

const NFTs = () => {
    const theme = useTheme();

    const sideAvatarSX = {
        borderRadius: '8px',
        width: 48,
        height: 48,
        fontSize: '1.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
        '&>svg': {
            width: 24,
            height: 24
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={12} md={4}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <MainCard>
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item>
                                    <Box
                                        sx={{
                                            ...sideAvatarSX,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.main + 20 : 'primary.light',
                                            border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                                            borderColor: 'primary.main',
                                            color: 'primary.dark'
                                        }}
                                    >
                                        <PeopleAltTwoToneIcon />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography variant="h3" color="primary" component="div" sx={{ mb: 0.625 }}>
                                        239k
                                    </Typography>
                                    <Typography variant="body2">Friends</Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size="large">
                                        <NavigateNextRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Divider sx={{ margin: '16px 0' }} />
                            <Grid container alignItems="center" spacing={gridSpacing}>
                                <Grid item>
                                    <Box
                                        sx={{
                                            ...sideAvatarSX,
                                            bgcolor: theme.palette.mode === 'dark' ? theme.palette.secondary.main + 20 : 'secondary.light',
                                            borderColor: 'secondary.main',
                                            color: 'secondary.dark'
                                        }}
                                    >
                                        <RecentActorsTwoToneIcon />
                                    </Box>
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            mb: 0.625,
                                            color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'secondary.main'
                                        }}
                                    >
                                        234k
                                    </Typography>
                                    <Typography variant="body2">Followers</Typography>
                                </Grid>
                                <Grid item>
                                    <IconButton size="large">
                                        <NavigateNextRoundedIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default NFTs;
