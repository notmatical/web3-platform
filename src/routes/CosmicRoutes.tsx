import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import CosmicGuard from 'utils/route-guard/CosmicGuard';
import AuthGuard from 'utils/route-guard/AuthGuard';

// cosmic astronauts applications
const CasStaking = Loadable(lazy(() => import('views/cosmic-astro/staking/Staking')));
const CasSniper = Loadable(lazy(() => import('views/cosmic-astro/sniping/Sniper')));
const ArtUpgrade = Loadable(lazy(() => import('views/cosmic-astro/art-upgrade/ArtUpgrade')));

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
            path: '#',
            element: <CasSniper />
        },
        {
            path: '/cosmicastro/upgrade',
            element: <ArtUpgrade />
        }
    ]
};

export default MainRoutes;
