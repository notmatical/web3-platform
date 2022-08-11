import dashboard from './dashboard';
import explore from './explore';
import applications from './applications';
import cosmicastro from './cosmicastro';
import socials from './socials';

// types
import { NavItemType } from 'types';

const menuItems: { items: NavItemType[] } = {
    items: [dashboard, explore, applications, cosmicastro, socials]
};

export default menuItems;
