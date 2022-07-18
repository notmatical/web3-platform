import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Box, Avatar, Typography } from '@mui/material';

// assets
import DefaultUser from 'assets/images/users/user-image.jpg';

interface WalletTokenProps {
    isSolana?: boolean;
    tokenData?: any;
}

const TrendingProfileCard = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            sx={{
                borderRadius: 4,
                border: '1px solid rgba(213, 217, 233, 0.2)',
                width: '100%',
                '&:hover': {
                    cursor: 'pointer',
                    transition: 'all .15s ease-in-out',
                    boxShadow: '0 0 0 2px rgb(213, 217, 233)'
                }
            }}
            onClick={() => navigate('/account/45rzLU1gPiEsaDtmkjvawgKDYYpSTHdVXKJjZ74dBDFg/portfolio')}
        >
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 1, mb: 1, gap: '8px' }}>
                <Avatar src={DefaultUser} sx={{ ...theme.typography.largeAvatar }} color="inherit" />
                <Typography noWrap variant="h5" fontWeight="800" sx={{ maxWidth: 140 }}>
                    matical.sol
                </Typography>
            </Box>
            <Stack
                display="flex"
                sx={{
                    p: 1,
                    width: '100%',
                    border: 0,
                    borderStyle: 'solid',
                    borderTopWidth: 1,
                    borderColor: 'rgba(213, 217, 233, 0.2)'
                }}
            >
                <Box display="flex" justifyContent="space-between">
                    <Typography noWrap variant="subtitle2" color="primary">
                        Followers
                    </Typography>
                    <Typography noWrap variant="subtitle2" fontWeight="600">
                        6987
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography noWrap variant="subtitle2" color="primary">
                        Last 24 Hours
                    </Typography>
                    <Typography noWrap variant="subtitle2" fontWeight="600">
                        +98
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default TrendingProfileCard;
