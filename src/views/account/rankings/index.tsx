import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';

// project imports
import TrendingProfileCard from './TrendingProfileCard';
import RankingProfileCard from './RankingProfileCard';
import { gridSpacing } from 'store/constant';

// graphql
import { useQuery } from '@apollo/client';
import { queries } from '../../../graphql/graphql';

const Lending = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { data, loading, error, fetchMore } = useQuery(queries.GET_LEADERBOARD, {
        variables: { first: 25 }
    });

    console.log(data, loading, error);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                {/* trending */}
                <Box display="flex" flexDirection="column" sx={{ gap: '8px', mb: 2 }}>
                    <Typography variant="h4">Trending</Typography>
                    <Box display="flex" flexDirection="row" justifyContent="space-between" sx={{ p: 1, gap: '12px' }}>
                        <TrendingProfileCard />
                        <TrendingProfileCard />
                        <TrendingProfileCard />
                        <TrendingProfileCard />
                    </Box>
                </Box>
            </Grid>
            {/* top 25 followers */}
            <Grid item xs={12} sx={{ pt: '0 !important' }}>
                {!loading && data.leaderboard !== null ? (
                    <Box display="flex" flexDirection="column" sx={{ gap: '12px' }}>
                        {data.leaderboard.map((user: any, index: number) => (
                            <RankingProfileCard key={index} position={index} user={user} />
                        ))}
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="row" justifyContent="center">
                        <CircularProgress color="secondary" />
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default Lending;
