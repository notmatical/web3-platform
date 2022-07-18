// material-ui
import { CardContent, Grid, Skeleton, Box } from '@mui/material';

// project import
import MainCard from '../MainCard';

const SpacesPlaceholder = () => (
    <MainCard content={false} boxShadow>
        <CardContent sx={{ p: '24px !important', justifyContent: 'center' }}>
            <Box display="flex" justifyContent="center">
                <Skeleton variant="circular" animation="wave" width={82} height={82} />
            </Box>

            <Box display="flex" justifyContent="center">
                <Skeleton variant="text" animation="wave" height={50} width={150} />
            </Box>

            <Box display="flex" justifyContent="center">
                <Skeleton variant="text" animation="wave" height={30} width={150} sx={{ marginBottom: '12px !important' }} />
            </Box>

            <Box display="flex" justifyContent="center">
                <Skeleton variant="rectangular" animation="wave" height={30} width={100} sx={{ borderRadius: '23px' }} />
            </Box>
        </CardContent>
    </MainCard>
);

export default SpacesPlaceholder;
