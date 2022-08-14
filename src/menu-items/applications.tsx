// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconAccessible, IconAtom, IconAffiliate, IconBox, IconRepeat, IconCalendar } from '@tabler/icons';

// constant
const icons = { IconAccessible, IconAtom, IconAffiliate, IconBox, IconRepeat, IconCalendar };

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const applications = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    type: 'group',
    children: [
        {
            id: 'swap',
            title: <FormattedMessage id="swap" />,
            type: 'item',
            url: '/swap',
            icon: icons.IconAccessible,
            breadcrumbs: false
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
        },
        {
            id: 'raffles',
            title: <FormattedMessage id="raffles" />,
            type: 'item',
            url: '/raffles',
            icon: icons.IconBox,
            breadcrumbs: true,
            hot: true
        },
        {
            id: 'mint-calendar',
            title: <FormattedMessage id="mint-calendar" />,
            type: 'item',
            url: '/applications/calendar',
            icon: icons.IconCalendar
        },
        {
            id: 'trade',
            title: <FormattedMessage id="trade" />,
            type: 'item',
            url: '/applications/trade',
            icon: icons.IconRepeat,
            hidden: true
        }
    ]
};

export default applications;
