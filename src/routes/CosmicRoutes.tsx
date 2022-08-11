import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// cosmic astronauts applications
const CasStaking = Loadable(lazy(() => import('views/cosmic-astro/staking/Staking')));
const CasSniper = Loadable(lazy(() => import('views/cosmic-astro/sniping/SniperHome')));

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        // Cosmic Astronauts Section
        {
            path: '/cosmicastro/staking',
            element: <CasStaking />
        },
        {
            path: '/cosmicastro/sniper',
            element: <CasSniper />
        }
    ]
};

export default MainRoutes;
