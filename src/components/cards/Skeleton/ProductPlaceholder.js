// material-ui
import { CardContent, Grid, Skeleton, Stack, Divider } from '@mui/material';

// project import
import MainCard from '../MainCard';

const CardPlaceholder = () => (
    <MainCard content={false} boxShadow>
        <Skeleton variant="rectangular" animation="wave" height={220} />
        <CardContent sx={{ p: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Skeleton variant="text" animation="wave" height={30} />
                </Grid>

                <Grid item xs={12} sx={{ pt: '0px !important' }}>
                    <Grid item>
                        <Skeleton variant="text" animation="wave" height={50} />
                    </Grid>

                    <Divider sx={{ mb: '10px' }} />
                </Grid>

                <Grid item xs={12} sx={{ pt: '0px !important' }}>
                    <Skeleton variant="text" animation="wave" height={30} />
                    <Skeleton variant="text" animation="wave" height={30} />
                </Grid>

                <Grid item xs={12}>
                    <Grid item>
                        <Skeleton variant="text" animation="wave" height={50} />
                    </Grid>

                    <Skeleton variant="text" animation="wave" height={30} />
                </Grid>
            </Grid>
        </CardContent>
    </MainCard>
);

export default CardPlaceholder;
