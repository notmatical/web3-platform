// material-ui
import { Box, Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

const StakeEmpty = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
            <Box sx={{ m: '5 auto', textAlign: 'center' }}>
                <Grid container justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Typography variant="h1" color="inherit" component="div">
                                    You do not own any unstaked Yaku collections.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    </Grid>
);

export default StakeEmpty;
