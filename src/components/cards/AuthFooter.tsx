// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://vaporize.fi" underline="hover">
            vaporize.fi
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://vaporize.fi" underline="hover">
            &copy; 2022 Vaporize Finance
        </Typography>
    </Stack>
);

export default AuthFooter;
