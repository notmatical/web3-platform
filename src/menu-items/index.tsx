import dashboard from './dashboard';
import applications from './applications';
import cosmicastro from './cosmicastro';
import socials from './socials';
import { NavItemType } from 'types';

const menuItems: { items: NavItemType[] } = {
    items: [dashboard, applications, cosmicastro, socials]
};

export default menuItems;
