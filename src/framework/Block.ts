import EventBus, { EventHandler } from "./EventBus";
import Handlebars from 'handlebars';

type Nullable<T> = T | null;

export type BlockEvent = (e: Event) => void;
export interface IBlockEvents {
    [key: string]: BlockEvent;
}

interface BlockProps {
    events?: IBlockEvents;
    attr?: Record<string, string | boolean | number>;
    [key: string]: unknown;
}

export default class Block<TProps extends BlockProps = BlockProps> {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render",
    } as const;

    protected _element: Nullable<HTMLElement> = null;
    protected _id: number = Math.floor(100000 + Math.random() * 900000);
    protected props: TProps;
    protected children: Record<string, Block> = {};
    protected lists: Record<string, Block[]> = {};
    private eventBus: () => EventBus;

    constructor(propsAndChildren: TProps = {} as TProps) {
        const eventBus = new EventBus();

        const { children, lists, props } = this._getChildrenPropsAndProps(propsAndChildren);
        this.children = children;
        this.lists = lists;

        this.props = this._makePropsProxy({ ...props } as TProps);
        this.eventBus = () => eventBus;
        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private _addEvents(): void {
        const { events = {} } = this.props;

        Object.entries(events).forEach(([eventName, handler]) => {
            this._element?.addEventListener(eventName, handler as EventListener);
        });
    }

    private _removeEvents(): void {
        const { events = {} } = this.props;

        Object.entries(events).forEach(([eventName, handler]) => {
            this._element?.removeEventListener(eventName, handler as EventListener);
        });
    }

    private _registerEvents(eventBus: EventBus): void {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this) as EventHandler);
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this) as EventHandler);
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as EventHandler);
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this) as EventHandler);
    }

    protected init(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    private _componentDidMount(): void {
        this.componentDidMount();

        Object.values(this.children).forEach(child => {
            child.dispatchComponentDidMount();
        });

        Object.values(this.lists).flat().forEach(child => {
            child.dispatchComponentDidMount();
        });
    }

    protected componentDidMount(): void { }

    dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(oldProps: TProps, newProps: TProps): void {
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        }
    }

    protected componentDidUpdate(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _oldProps: TProps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _newProps: TProps
    ): boolean {
        return true;
    }

    private _getChildrenPropsAndProps(propsAndChildren: TProps): {
        children: Record<string, Block>,
        lists: Record<string, Block[]>,
        props: BlockProps
    } {
        const children: Record<string, Block> = {};
        const lists: Record<string, Block[]> = {};
        const props: BlockProps = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (Array.isArray(value) && value.every(v => v instanceof Block)) {
                lists[key] = value;
            } else {
                props[key] = value;
            }
        });

        return { children, lists, props };
    }

    protected addAttributes(): void {
        const { attr } = this.props;

        if (attr && typeof attr === 'object') {
            this.setAttributes(attr);
        }
    }

    protected setAttributes(attr: Record<string, string | boolean | number>): void {
        Object.entries(attr).forEach(([key, value]) => {
            if (this._element) {
                this._element.setAttribute(key, String(value));
            }
        });
    }

    public setProps(nextProps: Partial<TProps>): void {
        if (!nextProps) return;
        Object.assign(this.props, nextProps);
    }

    get element(): Nullable<HTMLElement> {
        return this._element;
    }

    private _render(): void {
        const propsAndStubs: Record<string, unknown> = { ...this.props } as Record<string, unknown>;

        Object.entries(this.children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
        });

        Object.entries(this.lists).forEach(([key]) => {
            propsAndStubs[key] = `<div data-list-id="${key}"></div>`;
        });

        const fragment = document.createElement('template');
        fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

        Object.values(this.children).forEach(child => {
            const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
            if (stub) {
                stub.replaceWith(child.getContent());
            }
        });

        Object.entries(this.lists).forEach(([listKey, children]) => {
            const stub = fragment.content.querySelector(`[data-list-id="${listKey}"]`);
            if (!stub) return;

            const fragmentContainer = document.createDocumentFragment();
            children.forEach(child => {
                if (!child.element) child.getContent();
                fragmentContainer.appendChild(child.getContent());
            });

            stub.replaceWith(fragmentContainer);
        });

        const newElement = fragment.content.firstElementChild as HTMLElement;

        if (this._element) {
            this._removeEvents();
            this._element.replaceWith(newElement);
        }

        this._element = newElement;
        this._addEvents();
        this.addAttributes();
    }

    protected render(): string {
        return '';
    }

    public getContent(): HTMLElement {
        if (!this._element) {
            throw new Error('Element is not created');
        }
        return this._element;
    }

    private _makePropsProxy(props: TProps): TProps {
        return new Proxy(props, {
            get: (target, prop: string) => {
                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },
            set: (target, prop: string, value: unknown) => {
                const oldProps = { ...target };
                target[prop as keyof TProps] = value as TProps[keyof TProps];
                this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
                return true;
            },
            deleteProperty: () => {
                throw new Error('Нет доступа');
            },
        });
    }

    show(): void {
        if (this._element) {
            this._element.style.display = 'flex';
        }
    }

    hide(): void {
        if (this._element) {
            this._element.style.display = 'none';
        }
    }
}
