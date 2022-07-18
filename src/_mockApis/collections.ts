// third-party
import { v4 as UIDV4 } from 'uuid';
import { add, set, sub } from 'date-fns';
import _ from 'lodash';

// project imports
import services from 'utils/mockAdapter';

// types
import { ProjectStateProps, Projects } from 'types/collections';

// color variants
import value from 'assets/scss/_themes-vars.module.scss';

// calendar events
let projects: Projects[] = [
    {
        id: '5e8882f1f0c9216397e05a9b',
        image: 'cas-artwork.gif',
        name: 'Cosmic Astronauts',
        floorPrice: 57.62,
        avgSale: 56.42,
        volume: 186820.17,
        listedCount: 5
    },
    {
        id: '5e8882fcd525e076b3c1542c',
        image: 'degods.png',
        name: 'DeGods',
        floorPrice: 90.41,
        avgSale: 112.54,
        volume: 251490.49,
        listedCount: 5
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        image: 'tombstone.gif',
        name: 'TombStoned High Society',
        floorPrice: 9.25,
        avgSale: 8.37,
        volume: 49930.24,
        listedCount: 5
    },
    {
        id: '5e88830672d089c53c46ece3',
        image: 'cets.png',
        name: 'CETS ON CRECK',
        floorPrice: 24.12,
        avgSale: 24.63,
        volume: 82395.07,
        listedCount: 5
    },
    {
        id: '5e888302e62149e4b49aa609',
        image: 'portals.jpg',
        name: 'Portals',
        floorPrice: 62.99,
        avgSale: 92.38,
        volume: 225929.44,
        listedCount: 5
    },
    {
        id: '5e888302e62149e4b49aa709',
        image: 'bohemia.gif',
        name: 'Bohemia',
        floorPrice: 8.69,
        avgSale: 9.86,
        volume: 47844.42,
        listedCount: 5
    },
    {
        id: '5e8882f1f0c9216396e05a9b',
        image: 'degens.gif',
        name: 'DeGens',
        floorPrice: 0.39,
        avgSale: 0.59,
        volume: 7898.93,
        listedCount: 5
    },
    {
        id: '5e888302e62149e4b49aa610',
        image: 'akari.png',
        name: 'Akari',
        floorPrice: 6.7,
        avgSale: 7.53,
        volume: 13958.57,
        listedCount: 5
    },
    {
        id: '5e8882eb5f8ec686220ff131',
        image: 'blocksmith.gif',
        name: 'Blocksmith Labs',
        floorPrice: 17,
        avgSale: 13.27,
        volume: 40724.4,
        listedCount: 5
    },
    {
        id: '5e888302e62349e4b49aa609',
        image: 'zaysan.gif',
        name: 'Zaysan Raptors',
        floorPrice: 13.9,
        avgSale: 15.41,
        volume: 25122.41,
        listedCount: 5
    },
    {
        id: '5e888302e62149e4b49ab609',
        image: 'drippies.gif',
        name: 'Drippies™️',
        floorPrice: 3.1,
        avgSale: 3.72,
        volume: 29654.22,
        listedCount: 5
    }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/api/collections/projects').reply(200, { projects });

// services.onPost('/api/collections/projects/new').reply((request) => {
//     try {
//         const { allDay, description, color, textColor, end, start, title } = JSON.parse(request.data);
//         const event = {
//             id: UIDV4(),
//             allDay,
//             image,
//             description,
//             color,
//             textColor,
//             end,
//             start,
//             title
//         };

//         projects = [...projects, event];

//         return [200, projects];
//     } catch (err) {
//         console.error(err);
//         return [500, { message: 'Internal server error' }];
//     }
// });

services.onPost('/api/collections/projects/update').reply((request) => {
    try {
        const { eventId, update } = JSON.parse(request.data);

        projects = _.map(projects, (_event) => {
            if (_event.id === eventId) {
                _.assign(_event, { ...update });
            }

            return _event;
        });

        return [200, { projects }];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});

services.onPost('/api/collections/projects/remove').reply((request) => {
    try {
        const { eventId } = JSON.parse(request.data);
        projects = _.reject(projects, { id: eventId });

        return [200, projects];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});
