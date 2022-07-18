// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconLayout2, IconActivity, IconCoin, IconAtom, IconAffiliate, IconBox } from '@tabler/icons';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { OverrideIcon } from 'types';

// constant
const icons = {
    IconLayout2,
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
    title: <FormattedMessage id="dashboard" />,
    type: 'group',
    children: [
        {
            id: 'overview',
            title: <FormattedMessage id="overview" />,
            type: 'item',
            url: '/overview',
            icon: icons.IconLayout2,
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
