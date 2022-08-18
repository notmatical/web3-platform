// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconMicroscope, IconAccessible, IconAtom, IconAffiliate, IconBox, IconRepeat, IconCalendar } from '@tabler/icons';

// constant
const icons = { IconMicroscope, IconAccessible, IconAtom, IconAffiliate, IconBox, IconRepeat, IconCalendar };

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const applications = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    type: 'group',
    children: [
        {
            id: 'sniper',
            title: <FormattedMessage id="sniper" />,
            type: 'item',
            url: '/sniper',
            icon: icons.IconMicroscope,
            breadcrumbs: true
        },
        {
            id: 'swap',
            title: <FormattedMessage id="swap" />,
            type: 'item',
            url: '#',
            icon: icons.IconAccessible,
            breadcrumbs: false,
            soon: true
        },
        {
            id: 'collabs',
            title: <FormattedMessage id="collabs" />,
            type: 'item',
            url: '#',
            icon: icons.IconAtom,
            breadcrumbs: false,
            soon: true
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
            url: '/calendar',
            icon: icons.IconCalendar
        },
        {
            id: 'trade',
            title: <FormattedMessage id="trade" />,
            type: 'item',
            url: '#',
            icon: icons.IconRepeat,
            hidden: true
        }
    ]
};

export default applications;
