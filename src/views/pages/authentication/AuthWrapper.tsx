// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#0b0f19' : theme.palette.primary.light,
    minHeight: '100vh'
}));

export default AuthWrapper;
