import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// Explore
const Monitor = Loadable(lazy(() => import('views/explore/nfts/index')));

// applications
const Swap = Loadable(lazy(() => import('views/application/swap/index')));
const MintCalendar = Loadable(lazy(() => import('views/application/mint-calendar/index')));
const Lending = Loadable(lazy(() => import('views/application/lending/index')));
const Trading = Loadable(lazy(() => import('views/application/trade/index')));

// raffles
const Raffles = Loadable(lazy(() => import('views/application/raffles/index')));
const CreateRaffle = Loadable(lazy(() => import('views/application/raffles/CreateRaffle')));
const RaffleCreate = Loadable(lazy(() => import('views/application/raffles/RaffleCreate')));
const RafflePage = Loadable(lazy(() => import('views/application/raffles/RafflePage')));

// staff management
const Admin = Loadable(lazy(() => import('views/platforms/staff-management/admin/Admin')));
const Employee = Loadable(lazy(() => import('views/platforms/staff-management/employee/Employee')));

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
            path: '/swap',
            element: <Swap />
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

        // Staff Management
        {
            path: '/staff-management/admin',
            element: <Admin />
        },
        {
            path: '/staff-management/employee',
            element: <Employee />
        },

        // Explore
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
            element: <CreateRaffle />
        },
        {
            path: '/raffles/new/:mint',
            element: <RaffleCreate />
        },
        {
            path: '/raffle/:raffleKey',
            element: <RafflePage />
        }
    ]
};

export default MainRoutes;
