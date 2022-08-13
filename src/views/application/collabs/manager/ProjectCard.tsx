import { useEffect, useState, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, CardContent, CardMedia, Typography, Button, Divider } from '@mui/material';

// project imports
import { KeyedObject } from 'types';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import MainCard from 'components/MainCard';
import Disabled from 'components/Disabled';
import Enabled from 'components/Enabled';

// assets
import { useToasts } from 'hooks/useToasts';
import { displayGuildIcon } from 'utils/discord';

// test
import { useQuery, useMutation } from '@apollo/client';
import { mutations, queries } from '../../../graphql/graphql';
import { useNavigate } from 'react-router-dom';

// types
interface CollabCardProps extends KeyedObject {
    project: any;
}

const CollabCard = ({ project, loading }: CollabCardProps) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { showInfoToast } = useToasts();

    // mutations gql
    const [DiasbleCollabs] = useMutation(mutations.DISABLE_COLLABS);

    return (
        <>
            {loading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        color: theme.palette.primary.light,
                        padding: '1.25rem'
                    }}
                >
                    <CardMedia
                        sx={{ height: 160, borderRadius: 2 }}
                        image={displayGuildIcon(project.guildId, project.iconHash)}
                        title="Guild Icon"
                    />
                    <CardContent sx={{ p: '0 !important', justifyContent: 'center' }}>
                        {/* project name / description */}
                        <Box display="flex" flexWrap="wrap" flexDirection="column" alignItems="center" sx={{ mt: 2, mb: 2 }}>
                            <Typography variant="h4" fontWeight="600" color="inherit" sx={{ display: 'block' }}>
                                {project.name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{ lineHeight: '24px', display: 'block', textAlign: 'center' }}
                            >
                                {project.description}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Collabs
                            </Typography>
                            {project.isActive ? (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Enabled />
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block', paddingLeft: 0.5 }}>
                                        Open
                                    </Typography>
                                </Box>
                            ) : (
                                <Box display="flex" flexDirection="row" alignItems="center">
                                    <Disabled />
                                    <Typography variant="subtitle2" color="inherit" sx={{ display: 'block', paddingLeft: 0.5 }}>
                                        Closed
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Available Spots
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.spots ? `${project.spots}` : 'N/A'}
                            </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Request Price
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.price ? `${project.price} SOL` : 'FREE'}
                            </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Mint Date
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.mintDate ? `${project.mintDate}` : 'TBD'}
                            </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Mint Price
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.mintPrice ? `${project.mintPrice} SOL` : 'TBD'}
                            </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                Supply
                            </Typography>
                            <Typography variant="subtitle2" color="inherit" sx={{ display: 'block' }}>
                                {project.mintSupply ? `${project.mintSupply}` : 'TBD'}
                            </Typography>
                        </Box>

                        <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" color="primary" sx={{ display: 'block' }}>
                                {project.collabs.length === 0 ? 'No Pending Requests' : `${project.collabs.length} Pending Requests`}
                            </Typography>
                        </Box>

                        {/* manage */}
                        <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ ml: 1, mr: 1, mt: 1 }}>
                            <Button
                                disableElevation
                                color="secondary"
                                onClick={() => navigate(`/collabs/manage/${project.guildId}`)}
                                variant="contained"
                                fullWidth
                            >
                                Manage Project
                            </Button>
                        </Box>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

export default CollabCard;
