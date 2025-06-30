import Block from '../../framework/Block';
import Modal from '../../components/modal/modal';
import Field from '../../components/field/field';
import Button from '../../components/button/button';
import Link from '../../components/link/link';
import { validateForm } from '../../utils/validation';

export default class AuthPage extends Block {
    constructor() {
        const bodyComponents = [
            new Field({
                id: 'inputLogin',
                name: 'login',
                type: 'text',
                placeholder: 'Логин',
                className: 'auth-field'
            }),
            new Field({
                id: 'inputPassword',
                name: 'password',
                type: 'password',
                placeholder: 'Пароль',
                className: 'auth-field'
            }),
            new Button({
                className: 'button-primary',
                text: 'Войти',
                id: 'btnAuth',
                type: 'submit'
            }),
        ];

        const footerComponents = [
            new Link({
                text: 'Нет аккаунта?',
                url: '#'
            })
        ];

        const modal = new Modal({
            className: 'modal-auth',
            title: 'Вход',
            form: true,
            bodyContent: bodyComponents,
            footerContent: footerComponents,
            events: {
                submit: (e: Event) => this.handleSubmit(e)
            }
        });

        super({ modal });
    }

    handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
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
            <div class="auth">
                {{{modal}}}
            </div>
        `;
    }
}
