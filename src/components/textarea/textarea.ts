import Block from '../../framework/Block';
import { validateField } from '../../utils/validation';

interface ITextareaProps {
    name: string;
    placeholder: string;
    value?: string;
    className?: string;
    rows?: number;
    events?: {
        input?: (e: Event) => void;
        focus?: (e: Event) => void;
        blur?: (e: Event) => void;
    };
    [key: string]: unknown;
}

export default class Textarea extends Block<ITextareaProps> {
    constructor(props: ITextareaProps) {
        const blurHandler = (e: Event) => {
            this.handleBlur(e);
        };

        const events = {
            ...(props.events || {}),
            blur: blurHandler
        };

        const textareaClass = `textarea ${props.className || ''} ${props.error ? 'error' : ''}`;

        super({
            ...props,
            textareaClass,
            events
        });
    }

    handleBlur(e: Event): void {
        const target = e.target as HTMLTextAreaElement;
        const { name, value } = target;
        const error = validateField(name, value);
        this.setProps({
            error,
            value,
            textareaClass: `textarea ${this.props.className || ''} ${error ? 'error' : ''}`
        });
    }

    render(): string {
        return `
            <textarea
                name="${this.props.name}"
                class="${this.props.textareaClass}"
                placeholder="${this.props.placeholder}"
                rows="${this.props.rows || 1}"
            >${this.props.value || ''}</textarea>
        `;
    }
}
