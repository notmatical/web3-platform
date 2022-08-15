import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Button, Avatar, Stack, Box, InputAdornment, OutlinedInput, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import CollabsPlaceholder from 'components/cards/Skeleton/CollabsPlaceholder';

// graphql
import { useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// assets
import { IconSearch } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

const JobBrowse = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { data, loading, refetch } = useQuery(db.queries.GET_COMPANIES, { fetchPolicy: 'network-only' });

    console.log(data);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <MainCard
                    border={false}
                    boxShadow
                    content={false}
                    sx={{
                        width: '100%',
                        padding: '64px 32px',
                        display: 'flex',
                        flexFlow: 'row wrap'
                    }}
                >
                    <Grid item xs={12} sm={7}>
                        <Typography variant="h3" fontSize="2.1818rem">
                            Reach 50K+ potential candidates.
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
                            Post your job today for free. Promotions start at $99.
                        </Typography>
                        <Button variant="contained" color="secondary" sx={{ mt: 2, minWidth: '64px' }}>
                            Post a job
                        </Button>
                    </Grid>
                    <Grid item sm={5} sx={{ display: { md: 'block', xs: 'none' } }}>
                        <img src="https://material-kit-pro-react.devias.io/static/mock-images/jobs/job_browse_header.svg" alt="..." />
                    </Grid>
                </MainCard>
            </Grid>

            {data && data.getCompanies && data.getCompanies.length > 0 ? (
                data.getCompanies.map((company: any, index: any) => (
                    <Grid item xs={12} key={index}>
                        <MainCard boxShadow border={false}>
                            <Box display="flex" flexDirection="row">
                                <Avatar
                                    alt="Company Image"
                                    src={company.icon}
                                    sx={{
                                        borderRadius: 1,
                                        mr: 2,
                                        '&:hover': {
                                            cursor: 'pointer'
                                        },
                                        width: { xs: 40, sm: 40, md: 40 },
                                        height: { xs: 40, sm: 40, md: 40 }
                                    }}
                                />
                                <Stack>
                                    <Typography variant="h6" color="inherit" fontSize="1.0909rem">
                                        {company.name}
                                    </Typography>
                                    <Typography variant="body2" color="inherit">
                                        {company.bio}
                                    </Typography>
                                    <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 3 }}>
                                        <Typography variant="overline" color="inherit">
                                            {company.size}
                                        </Typography>
                                        <Typography variant="overline" color="inherit">
                                            4.5/5
                                        </Typography>
                                        <Typography variant="overline" color="inherit" fontSize="0.75rem" fontWeight="600">
                                            {company.verified ? 'Verified' : 'Not Verified'}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </MainCard>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <h1>nothing</h1>
                </Grid>
            )}

            <Grid item xs={12}>
                <MainCard boxShadow border={false}>
                    <Typography variant="body1" color="primary">
                        Post your job today for free. Promotions start at $99.
                    </Typography>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default JobBrowse;
