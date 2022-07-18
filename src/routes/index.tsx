import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import CosmicRoutes from './CosmicRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import Loadable from 'components/Loadable';

const Homepage = Loadable(lazy(() => import('views/pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([{ path: '/', element: <Homepage /> }, AuthenticationRoutes, LoginRoutes, PublicRoutes, MainRoutes, CosmicRoutes]);
}
