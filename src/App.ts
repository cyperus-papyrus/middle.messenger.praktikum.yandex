import Home from './pages/home/index';
import Router from './framework/Router';
import Auth from './pages/auth';
import Registration from './pages/registration';
import Profile from './pages/profile';
import ProfileChange from './pages/profileChange';
import ProfilePassChange from './pages/profilePassChange';
import { Page404, Page500 } from './pages/error/index';
import AuthAPI from './api/auth-api';

import Store from './framework/Store';

export const router = new Router('#app')

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
            if (currentPath === '/' || currentPath === '/auth' || currentPath === '/sign-up') {
                this.router.go('/messenger');
            }
        } else {
            if (currentPath !== '/auth' && currentPath !== '/sign-up') {
                this.router.go('/auth');
            }
        }
    }

    private _registerRoutes(): void {
        this.router.use('/', Home);
        this.router.use('/messenger', Home)
        this.router.use('/sign-up', Registration);
        this.router.use('/settings', Profile);

        this.router.use('/auth', Auth);
        this.router.use('/settings-change', ProfileChange);
        this.router.use('/settings-change-pass', ProfilePassChange);
        this.router.use('/500', Page500);
        this.router.use('/404', Page404);

        this.router.use('*', Page404);
    }
}
