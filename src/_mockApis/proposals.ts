// third-party
import { v4 as UIDV4 } from 'uuid';
import { add, set, sub } from 'date-fns';
import _ from 'lodash';

// project imports
import services from 'utils/mockAdapter';

// types
import { ProposalsProps } from 'types/proposals';

// proposals
let proposals: ProposalsProps[] = [
    {
        id: '5e8882f1f0c9216397e05a9b',
        title: '$DUST Integration for Raffles/Lottery',
        description: 'Yeah, lets integrate that shit',
        tags: ['Infrastructure'],
        type: true,
        status: true,
        created: new Date(2022, 3, 9),
        end: new Date(2022, 3, 12)
    },
    {
        id: '5e8882fcd525e076b3c1542c',
        title: 'Purchase Bluechip NFTs to grow the DAO wallet',
        description: 'yea uh huh, surely.',
        tags: ['Investments'],
        type: false,
        status: true,
        created: new Date(2022, 2, 15),
        end: new Date(2022, 2, 12)
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        title: 'Add Cardano Chain Support',
        description: 'The dashboard should support the Cardano blockchain',
        tags: ['Infrastructure', 'Investments'],
        type: false,
        status: false,
        created: new Date(2022, 2, 5),
        end: new Date(2022, 4, 26)
    }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/api/proposals/list').reply(200, { proposals });

services.onPost('/api/proposals/new').reply((request) => {
    try {
        const { title, description, tags, type, status, created, end } = JSON.parse(request.data);
        const proposal = {
            id: UIDV4(),
            title,
            description,
            tags,
            type,
            status,
            created,
            end
        };

        proposals = [...proposals, proposal];

        return [200, proposals];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});
