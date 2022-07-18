import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// project imports
import defaultConfig from 'config';
import Logo from 'components/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={defaultConfig.defaultPath}>
        <Logo />
    </Link>
);

export default LogoSection;
