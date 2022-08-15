import { useEffect, useState, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { shouldForwardProp } from '@mui/system';
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Button, Avatar, Stack, Box, Divider, Chip, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { getRelativeTimeFromEpoch, formatPrice } from 'utils/utils';
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';
import CollabsPlaceholder from 'components/cards/Skeleton/CollabsPlaceholder';

// graphql
import { useQuery } from '@apollo/client';
import * as db from 'database/graphql/graphql';

// assets
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import DoneIcon from '@mui/icons-material/Done';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';

const JobBrowse = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const { data, loading, refetch } = useQuery(db.queries.GET_RECENT_JOB_LISTINGS, {
        variables: { limit: 5 },
        fetchPolicy: 'network-only'
    });

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

            {data && data.getRecentJobListings && data.getRecentJobListings.length > 0 ? (
                data.getRecentJobListings.map((job: any, index: any) => (
                    <Grid item xs={12} key={index}>
                        <MainCard boxShadow border={false}>
                            <Box display="flex" flexDirection="row">
                                <Avatar
                                    alt="Company Image"
                                    src={job.company.icon}
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
                                        {job.company.name}
                                    </Typography>
                                    <Typography variant="body2" color="inherit">
                                        {job.company.bio}
                                    </Typography>
                                    <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: 3 }}>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <GroupIcon fontSize="small" style={{ marginRight: 6, color: theme.palette.primary.dark }} />
                                            <Typography variant="overline" color="primary" fontWeight="600">
                                                {job.company.size}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <StarIcon fontSize="small" style={{ marginRight: 6, color: theme.palette.primary.dark }} />
                                            <Typography variant="overline" color="primary" fontWeight="600">
                                                4.5/5
                                            </Typography>
                                        </Box>
                                        {job.company.verified && (
                                            <Box display="flex" flexDirection="row" alignItems="center">
                                                <VerifiedOutlinedIcon
                                                    fontSize="small"
                                                    style={{ marginRight: 6, color: theme.palette.info.dark }}
                                                />
                                                <Typography variant="overline" color="inherit" fontSize="0.75rem" fontWeight="600">
                                                    Verified
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                            </Box>

                            <Box
                                display="flex"
                                flexDirection="column"
                                sx={{ borderRadius: 2, mt: 2, border: '1px solid rgba(213, 217, 233, 0.2)' }}
                            >
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{ flexWrap: 'wrap', padding: '12px 16px' }}
                                >
                                    <Stack>
                                        <Typography variant="subtitle1" color="inherit">
                                            {job.title}
                                        </Typography>
                                        <Typography variant="caption" color="primary">
                                            {job.location} • $55k - $75k
                                        </Typography>
                                        <Box display="flex" flexDirection="row" sx={{ mt: 1, gap: 1 }}>
                                            <Chip
                                                icon={<AccountBalanceOutlinedIcon />}
                                                label={`${formatPrice.format(job.payRange[0])} - ${formatPrice.format(job.payRange[1])}
                                                ${job.rate}`}
                                                size="small"
                                            />
                                            {job.jobType.map((type: any) => (
                                                <Chip
                                                    icon={<ScheduleOutlinedIcon />}
                                                    label={type}
                                                    size="small"
                                                    onDelete={() => console.log('hi')}
                                                    deleteIcon={<DoneIcon />}
                                                />
                                            ))}
                                        </Box>
                                    </Stack>
                                    <Stack flexDirection="row" alignItems="center">
                                        <Typography variant="caption" color="primary">
                                            {getRelativeTimeFromEpoch(job.createdAt)}
                                        </Typography>
                                        <Button variant="text" size="small" color="secondary" sx={{ ml: 1 }}>
                                            Apply
                                        </Button>
                                    </Stack>
                                </Box>
                            </Box>
                        </MainCard>
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <h1>nothing</h1>
                </Grid>
            )}
        </Grid>
    );
};

export default JobBrowse;
