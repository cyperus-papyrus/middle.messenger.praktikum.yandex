import Block, { IBlockEvents, BlockEvent } from '../../framework/Block';
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

        const inputClass = `input ${props.className || ''} ${props.error ? 'error' : ''}`;

        super({
            ...props,
            inputClass,
            events
        });
    }

    handleBlur(e: FocusEvent) {
        const input = e.target as HTMLInputElement;
        const { name, value } = input;
        const error = validateField(name, value);
        console.log(error, value);
        this.setProps({ error, value });

        this.updateErrorClass();
    }

    private updateErrorClass() {
        if (this.element) {
            if (this.props.error) {
                this.element.classList.add('error');
            } else {
                this.element.classList.remove('error');
            }
        }
    }

    render(): string {
        return `
            <input
                {{#if id}}id="{{id}}"{{/if}}
                type="{{type}}"
                placeholder="{{placeholder}}"
                name="{{name}}"
                class="{{inputClass}}"
                {{#if value}}value="{{value}}"{{/if}}
                {{#each attr}}
                    {{@key}}="{{this}}"
                {{/each}}
            />
        `;
    }
}
