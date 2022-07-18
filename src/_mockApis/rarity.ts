// project imports
import services from 'utils/mockAdapter';

// third-party
import { add, sub } from 'date-fns';

// types
import { KeyedObject } from 'types';
import { NFTs } from 'types/rarity';

// products list
const nfts: NFTs[] = [
    {
        id: 1,
        rank: 640,
        image: '1.png',
        name: 'Astronaut #874',
        role: 'Adventurer',
        description: 'yes im a test description, metadata?',
        categories: ['placeholder4'],
        created: sub(new Date(), { days: 8, hours: 6, minutes: 20 })
    },
    {
        id: 2,
        rank: 3,
        image: 'rare.png',
        name: 'Astronaut #8',
        role: 'Commander',
        description: 'yes im a test description, metadata?',
        categories: ['cosmicastro'],
        created: sub(new Date(), { days: 10, hours: 8, minutes: 69 })
    },
    {
        id: 3,
        rank: 852,
        image: '3.png',
        name: 'Astronaut #328',
        role: 'Doctor',
        description: 'yes im a test description, metadata?',
        categories: ['placeholder4'],
        created: sub(new Date(), { days: 4, hours: 9, minutes: 50 })
    },
    {
        id: 4,
        rank: 1648,
        image: '4.png',
        name: 'Astronaut #2742',
        role: 'Mission Specialist',
        description: 'yes im a test description, metadata?',
        categories: ['oneironauts'],
        created: sub(new Date(), { days: 7, hours: 6, minutes: 45 })
    },
    {
        id: 5,
        rank: 242,
        image: '5.png',
        name: 'Astronaut #3874',
        role: 'Adventurer',
        description: 'yes im a test description, metadata?',
        categories: ['cosmicastro'],
        created: sub(new Date(), { days: 2, hours: 9, minutes: 45 })
    },
    {
        id: 6,
        rank: 1562,
        image: '6.png',
        name: 'Astronaut #1346',
        role: 'Doctor',
        description: 'yes im a test description, metadata?',
        categories: ['cosmicastro'],
        created: add(new Date(), { days: 6, hours: 10, minutes: 0 })
    },
    {
        id: 7,
        rank: 6,
        image: '7.png',
        name: 'Astronaut #1924',
        role: 'Commander',
        description: 'yes im a test description, metadata?',
        categories: ['cosmicastro'],
        created: add(new Date(), { days: 14, hours: 1, minutes: 55 })
    },
    {
        id: 8,
        rank: 3698,
        image: '8.png',
        name: 'Astronaut #4214',
        role: 'Adventurer',
        description: 'yes im a test description, metadata?',
        categories: ['oneironauts'],
        created: sub(new Date(), { days: 0, hours: 11, minutes: 10 })
    }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/api/nfts/list').reply(200, { nfts });

services.onPost('/api/nfts/filter').reply((config) => {
    try {
        const { filter } = JSON.parse(config.data);

        if (filter.sort === 'Rank High') {
            nfts.sort((a: NFTs, b: NFTs) => Number(b.rank) - Number(a.rank));
        }

        if (filter.sort === 'Rank Low') {
            nfts.sort((a, b) => Number(a.rank) - Number(b.rank));
        }

        if (filter.sort === 'Number High') {
            nfts.sort((a, b) => Number(a.id) - Number(b.id));
        }

        if (filter.sort === 'Number Low') {
            nfts.sort((a, b) => Number(a.id) - Number(b.id));
        }

        const results = nfts.filter((nft: KeyedObject) => {
            let searchMatches = true;

            if (filter.search) {
                const properties = ['name', 'rank', 'role'];
                let containsQuery = false;

                properties.forEach((property) => {
                    if (nft[property].toString().toLowerCase().includes(filter.search.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    searchMatches = false;
                }
            }

            const categoriesMatches =
                filter.categories.length > 0 && filter.categories.some((category: string) => category !== 'all')
                    ? filter.categories.some((category: string) => nft.categories.some((item: string) => item === category))
                    : true;

            return searchMatches && categoriesMatches;
        });

        return [200, results];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});

services.onPost('/api/nft/details').reply((config) => {
    try {
        const { id } = JSON.parse(config.data);

        let results;
        if (id === 'default') {
            [results] = nfts;
        } else {
            [results] = nfts.filter((product) => product.id === Number(id));
        }

        return [200, results];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});

services.onPost('/api/nft/related').reply((config) => {
    try {
        const { id } = JSON.parse(config.data);

        const results = nfts.filter((nft) => nft.id !== Number(id));

        return [200, results];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});
