// material-ui
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/vapor-logo-light.png';
import logo from 'assets/images/vapor-logo-dark.png';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Vaporize" width="150" />;
};

export default Logo;
