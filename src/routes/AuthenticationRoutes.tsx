import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// Wallet
const WalletLogin = Loadable(lazy(() => import('views/pages/authentication/auth-components/WalletLogin')));
const PurchasePass = Loadable(lazy(() => import('views/pages/authentication/auth-components/PurchasePass')));

// Linking
const LinkDiscord = Loadable(lazy(() => import('views/pages/authentication/auth-components/LinkDiscord')));

// Error Shit
const SolanaIssue = Loadable(lazy(() => import('views/pages/maintenance/SolanaIssue')));
const MaintenanceError = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('views/pages/maintenance/UnderConstruction')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <WalletLogin />
        },
        {
            path: '/purchase',
            element: <PurchasePass />
        },

        // Discord/Email
        {
            path: '/discord/link',
            element: <LinkDiscord />
        },
        {
            path: '/email/link',
            element: <LinkDiscord />
        },

        // Errors
        {
            path: '*',
            element: <MaintenanceError />
        },
        {
            path: '/solana',
            element: <SolanaIssue />
        },
        {
            path: '/under-construction',
            element: <MaintenanceUnderConstruction />
        }
    ]
};

export default AuthenticationRoutes;
