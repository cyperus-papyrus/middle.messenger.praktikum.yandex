import { expect } from 'chai';
import sinon from 'sinon';
import Router from './Router';
import Block from './Block';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
    url: 'http://localhost:3000'
});
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.history = dom.window.history;
global.Event = dom.window.Event;

class HomePage extends Block {
    render() {
        return '<div>Home Page</div>';
    }
}

class ProfilePage extends Block {
    render() {
        return '<div>Profile Page</div>';
    }
}

class NotFoundPage extends Block {
    render() {
        return '<div>Not Found</div>';
    }
}

describe('Router', () => {
    let router: Router;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        window.history.replaceState(null, '', '/');

        resetRouterInstance();

        router = new Router('#app');
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    function resetRouterInstance() {
        const routerClass = Router as unknown as { __instance: Router | null };
        if (routerClass.__instance) {
            routerClass.__instance = null;
        }
    }

    it('Должен создавать экземпляр роутера', () => {
        expect(router).to.be.instanceOf(Router);
    });

    it('Должен регистрировать роуты через use()', () => {
        router
            .use('/', HomePage)
            .use('/profile', ProfilePage);

        const route1 = router.getRoute('/');
        const route2 = router.getRoute('/profile');

        expect(route1).to.not.be.null;
        expect(route2).to.not.be.null;
    });

    it('Должен переходить по указанному пути с помощью go()', () => {
        router
            .use('/', HomePage)
            .use('/profile', ProfilePage)
            .use('*', NotFoundPage)
            .start();

        router.go('/profile');
        expect(window.location.pathname).to.equal('/profile');
    });

    it('Должен отображать правильный компонент при переходе', () => {
        router
            .use('/', HomePage)
            .use('/profile', ProfilePage)
            .use('*', NotFoundPage)
            .start();

        router.go('/profile');
        const content = document.querySelector('#app')?.innerHTML;
        expect(content).to.include('Profile Page');
    });

    it('Должен использовать отдельный роут для неизвестных путей', () => {
        router
            .use('/', HomePage)
            .use('*', NotFoundPage)
            .start();

        router.go('/unknown-path');
        const content = document.querySelector('#app')?.innerHTML;
        expect(content).to.include('Not Found');
    });

    it('Должен быть синглтоном', () => {
        const router1 = new Router('#app');
        const router2 = new Router('#app');

        expect(router1).to.equal(router2);
    });

    it('Должен выбрасывать ошибку при получении экземпляра без инициализации', () => {
        resetRouterInstance();

        expect(() => Router.getInstance()).to.throw('Router not initialized');
    });
});
