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
            url: '/under-construction',
            icon: icons.IconCrosshair
        },
        {
            id: 'staking',
            title: <FormattedMessage id="staking" />,
            type: 'item',
            url: '/cosmicastro/staking',
            icon: icons.IconBolt
        },
        {
            id: 'art-upgrade',
            title: <FormattedMessage id="art-upgrade" />,
            type: 'item',
            url: '/cosmicastro/upgrade',
            icon: icons.IconBolt
        },
        {
            id: 'cryo',
            title: <FormattedMessage id="cryo" />,
            type: 'item',
            url: '/under-construction',
            icon: icons.IconRocket
        },
        {
            id: 'rescue',
            title: <FormattedMessage id="rescue" />,
            type: 'item',
            url: '/under-construction',
            icon: icons.IconAlien
        }
    ]
};

export default cosmicastro;
