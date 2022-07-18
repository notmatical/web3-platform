/* eslint-disable */
import { Box, CardContent, CardMedia, Grid, Typography, Divider } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import { SwitcherCardProps } from 'types/switcher';
import SwitchModal from './SwitchModal';

const NftCard = ({ mint, role, image, name, item, startLoading, stopLoading, updatePage }: SwitcherCardProps) => {

    return (
        <>
            <MainCard
                content={false}
                boxShadow
                sx={{
                    '&:hover': {
                        transform: 'scale3d(1.03, 1.03, 1)',
                        transition: '.15s'
                    }
                }}
            >
                <CardMedia sx={{ height: 220 }} image={image} title={name} />
                <CardContent sx={{ p: 2, pb: '16px !important' }}>
                    {/* name */}
                    <Box display="flex" alignItems="center">
                        <Typography
                            fontWeight="800"
                            color="secondary"
                            sx={{ fontSize: '1.175rem', display: 'block', textDecoration: 'none', mr: 'auto' }}
                        >
                            {name}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 1 }} />

                    {/* Management Buttons */}
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                {
                                    <SwitchModal  
                                        mint={mint}
                                        role={role}
                                        name={name}
                                        image={image}
                                        item={item}
                                        startLoading={() => startLoading()}
                                        stopLoading={() => stopLoading()}
                                        updatePage={() => updatePage()}
                                    />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </MainCard>
        </>
    );
};

export default NftCard;
