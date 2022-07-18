// material-ui
import { CardContent, Grid, Skeleton, Stack, Divider } from '@mui/material';

// project import
import MainCard from '../MainCard';

const CollectionPlaceholder = () => (
    <MainCard content={false} boxShadow>
        <Skeleton variant="rectangular" animation="wave" height={220} />
        <CardContent sx={{ p: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Skeleton variant="text" animation="wave" height={30} />
                </Grid>

                <Grid item xs={12} sx={{ pt: '0px !important' }}>
                    <Skeleton variant="text" animation="wave" height={30} />
                    <Skeleton variant="text" animation="wave" height={30} />
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Skeleton variant="text" animation="wave" height={60} />
                        </Grid>
                        <Grid item xs={4}>
                            <Skeleton variant="text" animation="wave" height={60} />
                        </Grid>
                        <Grid item xs={4}>
                            <Skeleton variant="text" animation="wave" height={60} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
    </MainCard>
);

export default CollectionPlaceholder;
