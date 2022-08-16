// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconHome, IconActivity, IconCoin, IconAtom, IconAffiliate, IconBox } from '@tabler/icons';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { OverrideIcon } from 'types';

// constant
const icons = {
    IconHome,
    IconActivity,
    IconCoin,
    IconAtom,
    IconAffiliate,
    IconBox
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

interface DashboardMenuProps {
    id: string;
    title: React.ReactNode | string;
    type: string;
    children: {
        id: string;
        title: React.ReactNode | string;
        type: string;
        url: string;
        icon: OverrideIcon;
        breadcrumbs: boolean;
    }[];
}

const dashboard = {
    id: 'dashboard',
    title: ' ',
    type: 'group',
    children: [
        {
            id: 'home',
            title: <FormattedMessage id="home" />,
            type: 'item',
            url: '/home',
            icon: icons.IconHome,
            breadcrumbs: false
        },
        {
            id: 'feed',
            title: <FormattedMessage id="feed" />,
            type: 'item',
            url: '#',
            icon: icons.IconActivity,
            breadcrumbs: false,
            soon: true
        }
    ]
};

export default dashboard;
