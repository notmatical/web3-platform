// third-party
import { v4 as UIDV4 } from 'uuid';
import { add, set, sub } from 'date-fns';
import _ from 'lodash';

// project imports
import services from 'utils/mockAdapter';

// types
import { CalendarEventProps } from 'types/calendar';

// color variants
import value from 'assets/scss/_themes-vars.module.scss';

// calendar events
let events: CalendarEventProps[] = [
    {
        id: '5e8882f1f0c9216397e05a9b',
        allDay: false,
        color: value.secondaryMain,
        description: 'SCRUM Planning',
        start: sub(new Date(), { days: 12, hours: 0, minutes: 45 }),
        end: sub(new Date(), { days: 12, hours: 0, minutes: 30 }),
        title: 'Test Mint #7'
    },
    {
        id: '5e8882fcd525e076b3c1542c',
        allDay: false,
        color: value.secondaryMain,
        description: 'Sorry, John!',
        start: sub(new Date(), { days: 8, hours: 0, minutes: 45 }),
        end: sub(new Date(), { days: 8, hours: 0, minutes: 30 }),
        title: 'Test Mint #6'
    },
    {
        id: '5e8882e440f6322fa399eeb8',
        allDay: true,
        color: value.secondaryMain,
        description: 'Inform about new contract',
        start: sub(new Date(), { days: 6, hours: 6, minutes: 30 }),
        end: sub(new Date(), { days: 7, hours: 4, minutes: 30 }),
        title: 'Test Mint #10'
    },
    {
        id: '5e88830672d089c53c46ece3',
        allDay: false,
        color: value.secondaryMain,
        description: 'Get a new quote for the payment processor',
        start: set(new Date(), { hours: 10, minutes: 30 }),
        end: set(new Date(), { hours: 13, minutes: 30 }),
        title: 'Test Mint #8'
    },
    {
        id: '5e888302e62149e4b49aa609',
        allDay: false,
        color: value.secondaryMain,
        description: 'Discuss about the new project',
        start: add(new Date(), { days: 2, hours: 3, minutes: 30 }),
        end: add(new Date(), { days: 2, hours: 3, minutes: 20 }),
        title: 'Test Mint #3'
    },
    {
        id: '5e888302e62149e4b49aa709',
        allDay: false,
        color: value.secondaryMain,
        description: "Let's Go",
        start: add(new Date(), { days: 2, hours: 2, minutes: 30 }),
        end: add(new Date(), { days: 2, hours: 3, minutes: 30 }),
        title: 'Test Mint #1'
    },
    {
        id: '5e8882f1f0c9216396e05a9b',
        allDay: false,
        color: value.secondaryMain,
        description: 'SCRUM Planning',
        start: add(new Date(), { days: 2, hours: 3, minutes: 30 }),
        end: add(new Date(), { days: 2, hours: 4, minutes: 30 }),
        title: 'Test Mint #2'
    },
    {
        id: '5e888302e62149e4b49aa610',
        allDay: false,
        color: value.secondaryMain,
        description: "Let's Go",
        start: add(new Date(), { days: 2, hours: 3, minutes: 45 }),
        end: add(new Date(), { days: 2, hours: 4, minutes: 50 }),
        title: 'Test Mint #4'
    },
    {
        id: '5e888302e62349e4b49aa609',
        allDay: false,
        color: value.secondaryMain,
        description: 'Discuss about the project launch',
        start: add(new Date(), { days: 6, hours: 0, minutes: 15 }),
        end: add(new Date(), { days: 6, hours: 0, minutes: 20 }),
        title: 'Test Mint #5'
    },
    {
        id: '5e888302e62149e4b49ab609',
        allDay: false,
        color: value.secondaryMain,
        description: 'Discuss about the tour',
        start: add(new Date(), { days: 6, hours: 0, minutes: 15 }),
        end: add(new Date(), { days: 6, hours: 0, minutes: 20 }),
        title: 'Test Mint #6'
    }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/api/calendar/events').reply(200, { events });

services.onPost('/api/calendar/events/new').reply((request) => {
    try {
        const { allDay, description, color, textColor, end, start, title } = JSON.parse(request.data);
        const event = {
            id: UIDV4(),
            allDay,
            description,
            color,
            textColor,
            end,
            start,
            title
        };

        events = [...events, event];

        return [200, events];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});

services.onPost('/api/calendar/events/update').reply((request) => {
    try {
        const { eventId, update } = JSON.parse(request.data);

        events = _.map(events, (_event) => {
            if (_event.id === eventId) {
                _.assign(_event, { ...update });
            }

            return _event;
        });

        return [200, { events }];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});

services.onPost('/api/calendar/events/remove').reply((request) => {
    try {
        const { eventId } = JSON.parse(request.data);
        events = _.reject(events, { id: eventId });

        return [200, events];
    } catch (err) {
        console.error(err);
        return [500, { message: 'Internal server error' }];
    }
});
