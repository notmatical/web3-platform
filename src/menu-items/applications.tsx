// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconBox,
    IconBasket,
    IconRepeat,
    IconBolt,
    IconSearch,
    IconDeviceDesktopAnalytics,
    IconArchive,
    IconCalendar,
    IconTicket
} from '@tabler/icons';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// constant
const icons = {
    IconBox,
    IconDeviceDesktopAnalytics,
    IconBasket,
    IconRepeat,
    IconBolt,
    IconSearch,
    IconArchive,
    IconCalendar,
    IconTicket
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const applications = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    type: 'group',
    children: [
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
            id: 'monitor',
            title: <FormattedMessage id="monitor" />,
            type: 'item',
            url: '/monitor',
            icon: icons.IconDeviceDesktopAnalytics,
            breadcrumbs: false
        },
        {
            id: 'trade',
            title: <FormattedMessage id="trade" />,
            type: 'item',
            url: '/applications/trade',
            icon: icons.IconRepeat,
            hidden: true
        },
        {
            id: 'rarity-search',
            title: <FormattedMessage id="rarity-search" />,
            type: 'item',
            url: '/applications/rarity',
            icon: icons.IconSearch
        },
        {
            id: 'mint-calendar',
            title: <FormattedMessage id="mint-calendar" />,
            type: 'item',
            url: '/applications/calendar',
            icon: icons.IconCalendar
        }
    ]
};

export default applications;
