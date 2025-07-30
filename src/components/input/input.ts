import Block from '../../framework/Block';
import { IBlockEvents, BlockEvent } from '../../utils/types';
import { validateField } from '../../utils/validation';

interface IInputProps {
    id?: string;
    type?: string;
    placeholder?: string;
    name?: string;
    className?: string;
    attr?: Record<string, string>;
    events?: IBlockEvents;
    value?: string;
    error?: unknown;
    [key: string]: unknown;
}

export default class Input extends Block<IInputProps> {
    constructor(props: IInputProps) {
        const blurHandler: BlockEvent = (e: Event) => {
            this.handleBlur(e as FocusEvent);
        };

        const events: IBlockEvents = {
            ...(props.events || {}),
            blur: blurHandler
        };
        const inputClass = `input ${props.className || ''}${props.error ? ' error' : ''}`;

        super({
            ...props,
            inputClass,
            events
        });
    }

    handleBlur(e: Event): void {
        const input = e.target as HTMLInputElement;
        const { name, value } = input;
        const error = validateField(name, value);
        this.setProps({
            error,
            value,
            inputClass: `input ${this.props.className || ''}${error ? ' error' : ''}`
        });
    }


    public getValue(): string {
        const input = this.element as HTMLInputElement;
        return input.value;
    }

    render(): string {
        return `
            <input
                id=${this.props.id || ''}
                type="${this.props.type}"
                placeholder="${this.props.placeholder}"
                name="${this.props.name}"
                class="${this.props.inputClass}"
                value="${this.props.value || ''}"
            />
            `;
    }
}
