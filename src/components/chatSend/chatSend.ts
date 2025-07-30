import Block from '../../framework/Block';
import Textarea from '../textarea/textarea';
import Button from '../button/button';
import { validateForm } from '../../utils/validation';
import { IBlockProps } from '../../utils/types';

interface ChatSendProps extends IBlockProps {
    onSubmit: (message: string) => void;
}

export default class ChatSend extends Block<ChatSendProps> {
    constructor(props: ChatSendProps) {
        const textarea = new Textarea({
            name: 'message',
            placeholder: 'Сообщение',
            className: 'chat-send__input',
            rows: 1
        });

        const button = new Button({
            type: 'submit',
            className: 'chat-send__button button-primary',
            icon: 'Send'
        });

        super({
            ...props,
            textarea,
            button,
            events: {
                submit: (e: Event) => this.handleSubmit(e)
            }
        });
    }

    handleSubmit(e: Event): void {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const textarea = form.querySelector('textarea') as HTMLTextAreaElement;

        const message = formData.get('message')?.toString() || '';

        const errors = validateForm({ message });

        if (Object.keys(errors).length === 0) {
            this.props.onSubmit(message);
            textarea.value = '';
        } else {
            console.error('Validation errors:', errors);
        }
    }

    render(): string {
        return `
            <form class="chat-send">
                <div class="chat-send__input-container">
                    {{{textarea}}}
                </div>
                <div class="chat-send__button-container">
                    {{{button}}}
                </div>
            </form>
        `;
    }
}
