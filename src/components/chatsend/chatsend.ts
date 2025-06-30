import Block from '../../framework/Block';
import Textarea from '../textarea/textarea';
import Button from '../button/button';
import { validateForm } from '../../utils/validation';

export default class ChatSend extends Block {

    constructor() {
        const textarea = new Textarea({
            name: 'message',
            placeholder: 'Сообщение',
            className: 'chat-send__input',
        });

        const button = new Button({
            type: 'submit',
            className: 'chat-send__button button-primary',
            icon: 'Send'
        });

        super({
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

        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        const errors = validateForm(data);

        if (Object.keys(errors).length === 0) {
            console.log('Form data:', data);
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
