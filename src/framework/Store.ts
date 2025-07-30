import EventBus from './EventBus';
import { set } from '../utils/helpers';
import { AppState } from '../utils/types';

export enum StoreEvents {
    Updated = 'updated',
}

type State = AppState;

class Store extends EventBus {
    private state: State = {};

    public getState(): State {
        return this.state;
    }

    public set(path: string, value: unknown) {
        set(this.state, path, value);
        this.emit(StoreEvents.Updated);
    }

    public clear() {
        this.state = {};
        this.emit(StoreEvents.Updated);
    }
}

export default new Store();
