import Block from './Block';
import { Nullable } from '../utils/types';
import { isEqual } from '../utils/helpers';


function render(query: string, block: Block): HTMLElement {
    const root = document.querySelector(query);
    if (!root) {
        throw new Error(`Root element not found by selector: ${query}`);
    }

    root.innerHTML = "";
    root.append(block.getContent());
    return root as HTMLElement;
}

interface IRouteProps {
    rootQuery: string;
}

class Route {
    private _pathname: string;
    private _blockClass: new () => Block;
    private _block: Nullable<Block>;
    private _props: IRouteProps;

    constructor(
        pathname: string,
        view: new () => Block,
        routeProps: IRouteProps
    ) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = routeProps;
    }

    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave(): void {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string): boolean {
        return isEqual(pathname, this._pathname);
    }

    render(): void {
        if (!this._block) {
            this._block = new this._blockClass();
            render(this._props.rootQuery, this._block);
            return;
        }

        this._block.show();
    }
}

export default class Router {
    private static __instance: Router;
    private routes: Route[] = [];
    private history: History = window.history;
    private _currentRoute: Nullable<Route> = null;
    private _rootQuery: string = "";

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }
        this._rootQuery = rootQuery;
        Router.__instance = this;
    }

    static getInstance(): Router {
        if (!Router.__instance) {
            throw new Error("Router not initialized");
        }
        return Router.__instance;
    }
    use(pathname: string,
        block: new () => Block): this {
        const route = new Route(pathname, block, { rootQuery: this._rootQuery });
        this.routes.push(route);
        return this;
    }

    start(): void {
        window.onpopstate = ((event: PopStateEvent) => {
            const target = event.currentTarget as Window;
            this._onRoute(target.location.pathname);
        }).bind(this);

        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string): void {
        const route = this.getRoute(pathname) || this.getRoute('*');
        if (!route) {
            console.error(`Route not found: ${pathname}, redirecting to /404`);
            return;
        }
        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }
        this._currentRoute = route;
        route.render();
    }

    go(pathname: string): void {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }

    getRoute(pathname: string): Route | undefined {
        return this.routes.find(route => route.match(pathname));
    }
}
