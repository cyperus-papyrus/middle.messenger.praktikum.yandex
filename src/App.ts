import Home from './pages/home/index';
import Router from './framework/Router';
import Auth from './pages/auth';
import Registration from './pages/registration';
import Profile from './pages/profile';
import { Page404, Page500 } from './pages/error/index';
import AuthAPI from './api/auth-api';

import Store from './framework/Store';
import ProfileChangePage from './pages/profileChange';
import ProfilePassChangePage from './pages/profilePassChange';

export const router = new Router('#app')

enum Routes {
    SignIn = '/',
    SignUp = '/sign-up',
    Messenger = '/messenger',
    Settings = '/settings',
    ChangePass = '/settings-change-pass',
    ChagneProfile = '/settings-change',
    Error404 = '/404',
    Error500 = '/500'
}

export default class App {
    router: Router;

    constructor() {
        this.router = router;
        this._registerRoutes();
        this.init();
    }

    async init() {
        try {
            const user = await AuthAPI.getUser();
            Store.set('user', user);
        } catch {
            // pass
        } finally {
            this.redirectIfNeeded();
            this.router.start();
        }
    }

    private redirectIfNeeded() {
        const user = Store.getState().user;
        const currentPath = window.location.pathname;

        if (user) {
            if (currentPath === '/' || currentPath === '/sign-up') {
                this.router.go('/messenger');
            }
        } else {
            if (currentPath !== '/' && currentPath !== '/sign-up') {
                this.router.go('/');
            }
        }
    }

    private _registerRoutes(): void {
        this.router.use(Routes.SignIn, Auth);
        this.router.use(Routes.Messenger, Home)
        this.router.use(Routes.SignUp, Registration);
        this.router.use(Routes.Settings, Profile);
        this.router.use(Routes.ChagneProfile, ProfileChangePage);
        this.router.use(Routes.ChangePass, ProfilePassChangePage);
        this.router.use(Routes.Error500, Page500);
        this.router.use(Routes.Error404, Page404);

        this.router.use('*', Page404);
    }
}
