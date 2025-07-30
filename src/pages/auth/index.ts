import Block from '../../framework/Block';
import SinglePage from '../../components/singlepage/singlepage';
import Field from '../../components/field/field';
import Button from '../../components/button/button';
import Link from '../../components/link/link';
import { validateForm } from '../../utils/validation';
import { login } from '../../actions/auth';
import Store, { StoreEvents } from '../../framework/Store';
import Router from '../../framework/Router';

import Notification from '../../components/notification/notification';

export default class AuthPage extends Block {

    private notification: Notification | null = null;
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
                url: 'sign-up',
                className: 'link'
            })
        ];

        const singlePage = new SinglePage({
            className: 'singlePage-auth',
            title: 'Вход',
            form: true,
            bodyContent: bodyComponents,
            footerContent: footerComponents,
            events: {
                submit: (e: Event) => this.handleSubmit(e)
            }
        });

        const notification = new Notification({
            message: "",
            visible: false,
        });
        super({
            singlePage,
            notification
        });

        this.notification = notification;
        Store.on(StoreEvents.Updated, () => {
            if (Store.getState().user) {
                Router.getInstance().go('/messenger');
            }
        });

    }

    async handleSubmit(e: Event) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            login: formData.get('login') as string,
            password: formData.get('password') as string
        };

        const errors = validateForm(data);

        if (Object.keys(errors).length === 0) {
            try {
                await login(data);
            } catch (error) {
                console.error('Failed:', error);
                if (this.notification) {
                    this.notification.showUp(`Ошибка при авторизации: ${error}`, 'error');
                }
            }
        } else {
            console.error('Validation errors:', errors);
            if (this.notification) {
                this.notification.showUp("Ошибка!", 'error');
            }
        }
    }

    render(): string {
        return `
            <div class="auth">
                {{{singlePage}}}
                <div class="notification-container">
                    {{{ notification }}}
                </div>
            </div>
        `;
    }
}
