import Block from '../../framework/Block';
import { IBlockEvents } from '../../utils/types';
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
    input?: Block;
    [key: string]: unknown;
}

export default class Field extends Block<IFieldProps> {
    constructor(props: IFieldProps) {
        const input = new Input({
            ...props,
        });

        super({
            ...props,
            input
        });
    }

    public getValue(): string {
        return (this.children.input as Input).getValue();
    }

    public clearInput() {
        this.children.input.setProps({ value: '' });
    }

    setInputError() {
        this.children.input.setProps({
            error: this.props.error,
            inputClass: `input error`
        })
    }


    render(): string {
        return `
            <div class="field">
            {{{ input }}}
            <label class="input__label" for="${this.props.id}">${this.props.placeholder}</label>
            </div>
        `;
    }
}
