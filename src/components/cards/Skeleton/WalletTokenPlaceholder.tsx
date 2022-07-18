// material-ui
import { Stack, Box, Skeleton } from '@mui/material';

// assets
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const WalletTokenPlaceholder = () => (
    <>
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between" sx={{ p: 0.5, borderRadius: '4px' }}>
            <Box display="flex" flexDirection="row">
                <Skeleton variant="circular" animation="wave" width={34} height={34} />
                <Stack sx={{ ml: 1 }}>
                    <Skeleton variant="text" animation="wave" height={16} width={44} />
                    <Skeleton variant="text" animation="wave" height={16} width={44} />
                </Stack>
            </Box>
            <Box display="flex" flexDirection="row">
                <Stack direction="column" alignItems="flex-end" justifyContent="flex-start" sx={{ mr: 1 }}>
                    <Skeleton variant="text" animation="wave" height={16} width={44} />
                    <Skeleton variant="text" animation="wave" height={16} width={44} />
                </Stack>
                <NavigateNextRoundedIcon />
            </Box>
        </Stack>
    </>
);

export default WalletTokenPlaceholder;
