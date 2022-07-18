// third-party
import { v4 as UIDV4 } from 'uuid';
import { add, set, sub } from 'date-fns';
import _ from 'lodash';

// project imports
import services from 'utils/mockAdapter';

// types
import { SpacesProps } from 'types/spaces';

// spaces
let spaces: SpacesProps[] = [
    {
        id: '5e8882f1f0c9216397e05a9b',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmcRze1eMQxFAq5HYUcttoSaTQDftE48bqU5dQpQhLTGdh',
        name: 'Astro DAO',
        symbol: 'cas',
        members: 8400
    },
    {
        id: '5e8882fcd525e076b3c1542c',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmVEc3sawA2fuTXA6NEWo1TyQEyYV5CufZTcCvqef23SzU',
        name: 'Space #2',
        symbol: 's2',
        members: 81234
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmQUbua7sjtmr4KKZHuauACeAZXL5auqLYULNATwXjMioc',
        name: 'Space #3',
        symbol: 's3',
        members: 12512
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmUT2DswaneceFDh2ZQkLFidbozzbBFM27a4YBMvwSou9q',
        name: 'Space #4',
        symbol: 's4',
        members: 53123
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmWEiCSLyG1qstQJvRBA9hzdFwQ87ipwA9XQcHFtQhxsD2',
        name: 'Space #5',
        symbol: 'poth',
        members: 12512
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmf89h2b8Xc3D32PnXhvePXzvQnQ8c89udRmtjk6vFtt9C',
        name: 'Space #6',
        symbol: 'poth',
        members: 4151
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmUCcpTbJfF7CqdMb5DWMYuHiG5duuF1xgGQ1sqDNkJxNg',
        name: 'Space #7',
        symbol: 'poth',
        members: 5123
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmdmcmNw9h4H8yVcCqCMKgRfJgCJnjtVQhFzjeKHCxAjRu',
        name: 'Space #8',
        symbol: 'poth',
        members: 61236
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmNSGrgsvVBLw3AtmQEg5qKJABHCRTv9t5VNBzpXfeUTtE',
        name: 'Space #9',
        symbol: 'poth',
        members: 92912
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmVw3UcK7DVojjXDN173hLNy2p6H5XNgbg5covULyGUYiX',
        name: 'Space #10',
        symbol: 'poth',
        members: 1231
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmZRQsYKhhngFtkzDG6grSXtXpbem3sZgPPA6eWUu6VKF2',
        name: 'Space #11',
        symbol: 'poth',
        members: 5123
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        avatar: 'https://worker.snapshot.org/mirror?img=https%3A%2F%2Fcloudflare-ipfs.com%2Fipfs%2FQmYVHhTFGjkiR7EMTsmTWSoSVU7cw1G6Y9WuXHZzTJV4pH',
        name: 'Space #12',
        symbol: 'poth',
        members: 14300
    }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/api/spaces/list').reply(200, { spaces });

services.onPost('/api/spaces/new').reply((request) => {
    try {
        const { avatar, name, members, symbol } = JSON.parse(request.data);
        const space = {
            id: UIDV4(),
            avatar,
            name,
            symbol,
            members
        };

        spaces = [...spaces, space];

        return [200, spaces];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});
