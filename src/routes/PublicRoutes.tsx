import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// Dashboard
const Home = Loadable(lazy(() => import('views/dashboard/home')));
const Feed = Loadable(lazy(() => import('views/dashboard/feed')));

// account routing
const SocialRanking = Loadable(lazy(() => import('views/account/rankings')));
const UserAccount = Loadable(lazy(() => import('views/account')));

// gamification
const Quests = Loadable(lazy(() => import('views/gamification/Quests')));

// spaces
const Spaces = Loadable(lazy(() => import('views/application/spaces/index')));
const SpacePage = Loadable(lazy(() => import('views/application/spaces/SpacePage')));
const ProposalCreate = Loadable(lazy(() => import('views/application/spaces/proposals/ProposalCreate')));
const ProposalPage = Loadable(lazy(() => import('views/application/spaces/proposals/ProposalPage')));

// collabs
const Collabs = Loadable(lazy(() => import('views/application/collabs/index')));
const CollabsManage = Loadable(lazy(() => import('views/application/collabs/manager/index')));
const CollabsProjectView = Loadable(lazy(() => import('views/application/collabs/manager/ProjectView')));

// Collection / NFT Aggreation
const CollectionView = Loadable(lazy(() => import('views/pages/project/index')));
const NftView = Loadable(lazy(() => import('views/pages/project/NftView')));

// Tokens
const TokenDirectory = Loadable(lazy(() => import('views/pages/token/index')));
const TokenView = Loadable(lazy(() => import('views/pages/token/TokenView')));

const PublicRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        // User
        {
            path: '/ranking',
            element: <SocialRanking />
        },
        {
            path: '/account/:vanity',
            element: <UserAccount />
        },

        // Gamification
        {
            path: '/quests',
            element: <Quests />
        },
        {
            path: '/rewards',
            element: <Quests />
        },

        // Activity / NFT
        {
            path: '/feed',
            element: <Feed />
        },
        {
            path: '/nft/:projectSlug',
            element: <CollectionView />
        },
        {
            path: '/nft/:projectSlug/:tokenAddress',
            element: <NftView />
        },

        // General
        {
            path: '/home',
            element: <Home />
        },

        // Spaces
        {
            path: '/spaces',
            element: <Spaces />
        },
        {
            path: '/spaces/:symbol',
            element: <SpacePage />
        },
        {
            path: '/spaces/:symbol/create',
            element: <ProposalCreate />
        },
        {
            path: '/spaces/:symbol/proposal/:id',
            element: <ProposalPage />
        },

        // Collabs
        {
            path: '/collabs',
            element: <Collabs />
        },
        {
            path: '/collabs/manage',
            element: <CollabsManage />
        },
        {
            path: '/collabs/manage/:guildId',
            element: <CollabsProjectView />
        },

        // Tokens
        {
            path: '/tokens',
            element: <TokenDirectory />
        },
        {
            path: '/token/:network/:tokenAddress/:tokenIdentifier',
            element: <TokenView />
        }
    ]
};

export default PublicRoutes;
