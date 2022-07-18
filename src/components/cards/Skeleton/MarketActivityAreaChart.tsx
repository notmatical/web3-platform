// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

const MarketActivityAreaChart = () => (
    <Card>
        <CardContent>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                        <Grid item xs zeroMinWidth>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Skeleton variant="text" animation="wave" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rectangular" animation="wave" height={20} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Skeleton variant="rectangular" animation="wave" height={50} width={80} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" animation="wave" height={530} />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

export default MarketActivityAreaChart;
