// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBolt, IconRocket, IconAlien, IconNotes, IconCrosshair } from '@tabler/icons';

// constant
const icons = {
    IconBolt,
    IconAlien,
    IconRocket,
    IconNotes,
    IconCrosshair
};

// ==============================|| COSMIC ASTRONAUTS MENU ITEMS ||============================== //

const cosmicastro = {
    id: 'cosmicastro',
    title: <FormattedMessage id="cosmicastro" />,
    caption: <FormattedMessage id="cosmicastro-caption" />,
    type: 'group',
    children: [
        {
            id: 'sniper',
            title: <FormattedMessage id="sniper" />,
            type: 'item',
            url: '/cosmicastro/sniper',
            icon: icons.IconCrosshair
        },
        {
            id: 'staking',
            title: <FormattedMessage id="staking" />,
            type: 'item',
            url: '/cosmicastro/staking',
            icon: icons.IconBolt
        }
    ]
};

export default cosmicastro;
