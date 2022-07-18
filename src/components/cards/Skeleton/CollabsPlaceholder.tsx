// material-ui
import { CardContent, Typography, Skeleton, Box, Divider } from '@mui/material';

// project import
import MainCard from '../MainCard';

const CollabsPlaceholder = () => (
    <MainCard content={false} boxShadow sx={{ padding: '1.25rem' }}>
        <Skeleton variant="rectangular" animation="wave" height={160} />
        <CardContent sx={{ p: '0px !important', justifyContent: 'center' }}>
            <Box display="flex" flexWrap="wrap" flexDirection="column" alignItems="center" sx={{ mt: 2, mb: 2 }}>
                <Skeleton variant="text" animation="wave" width="100%" />
                <Skeleton variant="text" animation="wave" width="100%" />
            </Box>

            <Divider />

            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 2, paddingLeft: 1 }}>
                <Skeleton variant="text" animation="wave" width="30%" />
                <Skeleton variant="text" animation="wave" width="20%" />
            </Box>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5, paddingLeft: 1 }}>
                <Skeleton variant="text" animation="wave" width="30%" />
                <Skeleton variant="text" animation="wave" width="20%" />
            </Box>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5, paddingLeft: 1 }}>
                <Skeleton variant="text" animation="wave" width="30%" />
                <Skeleton variant="text" animation="wave" width="20%" />
            </Box>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" sx={{ mt: 0.5, paddingLeft: 1 }}>
                <Skeleton variant="text" animation="wave" width="30%" />
                <Skeleton variant="text" animation="wave" width="20%" />
            </Box>

            <Box display="flex" flexWrap="wrap" justifyContent="center" sx={{ ml: 1, mr: 1, mt: 2 }}>
                <Skeleton variant="rectangular" animation="wave" width="100%" height={40} sx={{ borderRadius: 1 }} />
            </Box>
        </CardContent>
    </MainCard>
);

export default CollabsPlaceholder;
