import { useEffect, useState } from 'react';

// material-ui
import { CardContent, CardMedia, Grid, Divider, Typography, Stack, Box } from '@mui/material';

// project import
import MainCard from './MainCard';
import Chip from 'components/@extended/Chip';
import SkeletonProductPlaceholder from 'components/cards/Skeleton/ProductPlaceholder';
import { NftCardProps } from 'types/rarity';

const prodImage = require.context('assets/images/nft-test', true);

const NftCard = ({ id, name, image, description, role, rank }: NftCardProps) => {
    const prodProfile = image && prodImage(`./${image}`).default;

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const rankString = `Rank #${rank}`;

    return (
        <>
            {isLoading ? (
                <SkeletonProductPlaceholder />
            ) : (
                <MainCard
                    content={false}
                    boxShadow
                    sx={{
                        borderColor: '#d4425b',
                        '&:hover': {
                            transform: 'scale3d(1.02, 1.02, 1)',
                            transition: 'all .4s ease-in-out'
                        }
                    }}
                >
                    <CardMedia sx={{ height: 220 }} image={prodProfile} title={name} />
                    <CardContent sx={{ p: '12px !important' }}>
                        <Grid container sx={{ justifyContent: 'center' }}>
                            <Grid item xs={12} sx={{ m: '5px !important' }}>
                                <Typography
                                    fontWeight="800"
                                    color="secondary"
                                    sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                                >
                                    {name}
                                </Typography>
                            </Grid>

                            <Box display="flex" justifyContent="center">
                                <Chip label="Artifact" size="small" chipcolor="secondary" sx={{ mr: '5px', borderRadius: '4px' }} />
                                {role && (
                                    <>
                                        <Chip label={role} size="small" chipcolor="info" sx={{ mr: '5px', borderRadius: '4px' }} />
                                    </>
                                )}
                                <Chip label={rankString} size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />

                                <Divider sx={{ mt: 2, mb: 2 }} />
                            </Box>

                            {/* <Grid item xs={12} sx={{ alignItems: 'center', pt: '2px !important' }}>
                                <Divider sx={{ mt: 1, mb: 1 }} />
                            </Grid>
                            <Grid item xs={12} sx={{ alignItems: 'center', pt: '2px !important' }}>
                                <Chip label="Light Purple" size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />
                                <Chip label="None" size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />
                                <Chip label="Half" size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />
                                <Chip
                                    label="Glass: Green Glowing Eyes"
                                    size="small"
                                    chipcolor="primary"
                                    sx={{ mr: '5px', borderRadius: '4px' }}
                                />
                                <Chip label="None" size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />
                                <Chip label="Full Suite" size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />
                                <Chip label="Water Orb" size="small" chipcolor="primary" sx={{ mr: '5px', borderRadius: '4px' }} />
                            </Grid> */}
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

export default NftCard;
