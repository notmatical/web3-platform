// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrandTwitter, IconBrandDiscord, IconSitemap } from '@tabler/icons';

// constant
const icons = {
    IconBrandTwitter,
    IconBrandDiscord,
    IconSitemap
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'social-links',
    type: 'group',
    children: [
        {
            id: 'social-twitter',
            title: <FormattedMessage id="social-twitter" />,
            type: 'item',
            url: 'https://twitter.com/vaporize_fi',
            icon: icons.IconBrandTwitter,
            external: true,
            target: true
        },
        {
            id: 'social-discord',
            title: <FormattedMessage id="social-discord" />,
            type: 'item',
            url: 'https://discord.gg/bWSUSsETH6',
            icon: icons.IconBrandDiscord,
            external: true,
            target: true
        },
        {
            id: 'feature-request',
            title: <FormattedMessage id="feature-request" />,
            type: 'item',
            url: 'https://vaporize.canny.io',
            icon: icons.IconSitemap,
            external: true,
            target: true
        }
    ]
};

export default other;
