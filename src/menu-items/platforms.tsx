// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSubtask, IconBuilding } from '@tabler/icons';

// constant
const icons = { IconSubtask, IconBuilding };

// ==============================|| PLATFORMS MENU ITEMS ||============================== //

const platforms = {
    id: 'platforms',
    title: <FormattedMessage id="platforms" />,
    type: 'group',
    children: [
        {
            id: 'staff-management',
            title: <FormattedMessage id="staff-management" />,
            type: 'collapse',
            icon: icons.IconSubtask,
            children: [
                {
                    id: 'admin',
                    title: <FormattedMessage id="project-manager" />,
                    type: 'item',
                    url: '/staff-management/admin',
                    breadcrumbs: false
                },
                {
                    id: 'employee',
                    title: <FormattedMessage id="employee" />,
                    type: 'item',
                    url: '/staff-management/employee',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'job-listings',
            title: <FormattedMessage id="job-listing" />,
            type: 'collapse',
            icon: icons.IconBuilding,
            children: [
                {
                    id: 'browse',
                    title: <FormattedMessage id="job-browse" />,
                    type: 'item',
                    url: '/jobs',
                    breadcrumbs: false
                },
                {
                    id: 'employee',
                    title: <FormattedMessage id="job-create" />,
                    type: 'item',
                    url: '/jobs/new',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default platforms;
