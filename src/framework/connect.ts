import store, { StoreEvents } from './Store';
import Block from './Block';
import { isEqual } from '../utils/helpers';

import { AppState } from '../utils/types';

type MapStateToProps = (state: AppState) => Record<string, unknown>;

export function connect(mapStateToProps: MapStateToProps) {
    return function <P extends Record<string, unknown>>(Component: new (props: P) => Block<P>) {
        return class extends Component {
            protected _connectStoreUpdate: () => void;

            constructor(props: P) {
                const state = mapStateToProps(store.getState());

                super({ ...props, ...state } as P);

                let currentState = state;

                this._connectStoreUpdate = () => {
                    const newState = mapStateToProps(store.getState());

                    if (!isEqual(currentState, newState)) {
                        this.setProps({ ...newState } as Partial<P>);
                        currentState = newState;
                    }
                };

                store.on(StoreEvents.Updated, this._connectStoreUpdate);
            }

            componentWillUnmount() {
                super.componentWillUnmount?.();
                store.off(StoreEvents.Updated, this._connectStoreUpdate);
            }
        };
    };
}
