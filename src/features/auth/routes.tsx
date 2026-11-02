import lazyLoad from '../../helpers/lazyLoad';
import { RoutesView } from '../../navigation/routes';
import type { RouteConfig } from '../../navigation/types';

const LoginScreen = lazyLoad(() =>
  import('./screens/LoginScreen').then((module) => ({
    default: module.LoginScreen,
  }))
);

export const AUTH_ROUTES: RouteConfig[] = [
  {
    path: RoutesView.LOGIN,
    element: <LoginScreen />,
    isProtected: false,
  },
];

export default AUTH_ROUTES;
