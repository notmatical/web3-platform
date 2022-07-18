import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import defaultConfig from 'config';
import Logo from 'components/Logo';

// ==============================|| MAIN LOGO ||============================== //

const SolanaStats = () => (
    <Grid display="flex" sx={{ height: '30px' }}>
        <Typography> Solana Network: </Typography>
    </Grid>
);

export default SolanaStats;
