// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://yaku.ai" underline="hover">
            yaku.ai
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://yaku.ai" underline="hover">
            &copy; 2022 Yaku Labs
        </Typography>
    </Stack>
);

export default AuthFooter;
