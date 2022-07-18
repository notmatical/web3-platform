import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'components/Loadable';

// login routing
const WalletLogin = Loadable(lazy(() => import('views/pages/authentication/auth-components/WalletLogin')));
const PurchasePass = Loadable(lazy(() => import('views/pages/authentication/auth-components/PurchasePass')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/test',
            element: <WalletLogin />
        },
        {
            path: '/test2',
            element: <PurchasePass />
        }
    ]
};

export default LoginRoutes;
