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
            url: '/',
            icon: icons.IconHome,
            breadcrumbs: false
        },
        {
            id: 'activity',
            title: <FormattedMessage id="activity" />,
            type: 'item',
            url: '/activity',
            icon: icons.IconActivity,
            breadcrumbs: false
        },
        {
            id: 'tokens',
            title: <FormattedMessage id="tokens" />,
            type: 'item',
            url: '/tokens',
            icon: icons.IconCoin,
            breadcrumbs: false,
            new: true
        },
        {
            id: 'collabs',
            title: <FormattedMessage id="collabs" />,
            type: 'item',
            url: '/collabs',
            icon: icons.IconAtom,
            breadcrumbs: false
        },
        {
            id: 'spaces',
            title: <FormattedMessage id="spaces" />,
            type: 'item',
            url: '/spaces',
            icon: icons.IconAffiliate,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
