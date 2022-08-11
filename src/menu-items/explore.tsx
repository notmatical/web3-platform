// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconStar, IconChartLine, IconChartBubble } from '@tabler/icons';

// constant
const icons = { IconStar, IconChartLine, IconChartBubble };

// ==============================|| EXPLORE MENU ITEMS ||============================== //

const explore = {
    id: 'explore',
    title: <FormattedMessage id="explore" />,
    type: 'group',
    children: [
        {
            id: 'nfts',
            title: <FormattedMessage id="nfts" />,
            type: 'item',
            url: '/nft',
            icon: icons.IconStar,
            breadcrumbs: false
        },
        {
            id: 'defi',
            title: <FormattedMessage id="defi" />,
            type: 'item',
            url: '#',
            icon: icons.IconChartLine,
            breadcrumbs: false,
            soon: true
        },
        {
            id: 'dao',
            title: <FormattedMessage id="dao" />,
            type: 'item',
            url: '#',
            icon: icons.IconChartBubble,
            breadcrumbs: false,
            soon: true
        }
    ]
};

export default explore;
