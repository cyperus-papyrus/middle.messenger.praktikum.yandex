import Block, { IBlockEvents } from '../../framework/Block';
import Input from '../input/input';

interface IFieldProps {
    id?: string;
    type?: string;
    placeholder?: string;
    name?: string;
    className?: string;
    attr?: Record<string, string>;
    events?: IBlockEvents;
    error?: string;
    value?: string;
    [key: string]: unknown;
}

export default class Field extends Block<IFieldProps> {
    constructor(props: IFieldProps) {
        const input = new Input({
            ...props,
            className: `${props.className || ''} ${props.error ? 'input_error' : ''}`,
            error: props.error
        });

        super({
            ...props,
            input
        });
    }

    render(): string {
        return `
            <div class="field">
                {{{ input }}}
                ${this.props.error ? `<div class="field__error">${this.props.error}</div>` : ''}
            </div>
        `;
    }
}
