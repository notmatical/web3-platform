import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// applications
const RaritySearch = Loadable(lazy(() => import('views/application/rarity-search/Rarity')));
const MintCalendar = Loadable(lazy(() => import('views/application/mint-calendar/index')));
const Lending = Loadable(lazy(() => import('views/application/lending/index')));
const Trading = Loadable(lazy(() => import('views/application/trade/index')));

// monitor
const Monitor = Loadable(lazy(() => import('views/application/monitor/index')));

// raffles
const Raffles = Loadable(lazy(() => import('views/application/raffles/index')));
const RaffleCreate = Loadable(lazy(() => import('views/application/raffles/RaffleCreate')));
const RafflePage = Loadable(lazy(() => import('views/application/raffles/RafflePage')));

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        // Applications
        {
            path: '/applications/rarity',
            element: <RaritySearch />
        },
        {
            path: '/applications/calendar',
            element: <MintCalendar />
        },
        {
            path: '/applications/lending',
            element: <Lending />
        },
        {
            path: '/applications/trade',
            element: <Trading />
        },

        // Monitor
        {
            path: '/nft',
            element: <Monitor />
        },
        {
            path: '/project/:projectName',
            element: <Monitor />
        },

        // Raffles
        {
            path: '/raffles',
            element: <Raffles />
        },
        {
            path: '/raffles/create',
            element: <RaffleCreate />
        },
        {
            path: '/raffle/:raffleKey',
            element: <RafflePage />
        }
    ]
};

export default MainRoutes;
