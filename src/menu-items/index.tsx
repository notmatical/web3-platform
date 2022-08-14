import dashboard from './dashboard';
import explore from './explore';
import applications from './applications';
import platforms from './platforms';
import cosmicastro from './cosmicastro';
import socials from './socials';

// types
import { NavItemType } from 'types';

const menuItems: { items: NavItemType[] } = {
    items: [dashboard, explore, applications, platforms, cosmicastro, socials]
};

export default menuItems;
