// material-ui
import { useTheme } from '@mui/material/styles';

import logoDark from 'assets/images/icons/discord-dark.svg';
import logo from 'assets/images/icons/discord.svg';

const Logo = () => {
    const theme = useTheme();

    return <img src={theme.palette.mode === 'dark' ? logo : logoDark} alt="Discord" width="24" />;
};

export default Logo;
