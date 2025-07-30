import Block from '../../framework/Block';
import SinglePage from '../../components/singlepage/singlepage';
import Field from '../../components/field/field';
import Button from '../../components/button/button';
import { validateForm } from '../../utils/validation';
import { register } from '../../actions/auth';
import Store, { StoreEvents } from '../../framework/Store';
import Router from '../../framework/Router';

import Notification from '../../components/notification/notification';

export default class RegistrationPage extends Block {

    private notification: Notification | null = null;
    constructor() {
        const bodyComponents = [
            new Field({
                id: 'inputFirstName',
                name: 'first_name',
                type: 'text',
                placeholder: 'Имя',
                className: 'registration-field'
            }),
            new Field({
                id: 'inputSecondName',
                name: 'second_name',
                type: 'text',
                placeholder: 'Фамилия',
                className: 'registration-field'
            }),
            new Field({
                id: 'inputLogin',
                name: 'login',
                type: 'text',
                placeholder: 'Логин',
                className: 'registration-field'
            }),
            new Field({
                id: 'inputPassword',
                name: 'password',
                type: 'password',
                placeholder: 'Пароль',
                className: 'registration-field'
            }),
            new Field({
                id: 'inputEmail',
                name: 'email',
                type: 'email',
                placeholder: 'Электронная почта',
                className: 'registration-field'
            }),
            new Field({
                id: 'inputPhone',
                name: 'phone',
                type: 'tel',
                placeholder: 'Телефон',
                className: 'registration-field'
            }),
            new Button({
                className: 'button-primary',
                text: 'Войти',
                id: 'btnRegister'
            }),
        ];

        const singlePage = new SinglePage({
            className: 'singlePage-registration',
            title: 'Регистрация',
            form: true,
            bodyContent: bodyComponents,
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
            first_name: formData.get('first_name') as string,
            second_name: formData.get('second_name') as string,
            login: formData.get('login') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            phone: formData.get('phone') as string
        };

        const errors = validateForm(data);

        if (Object.keys(errors).length === 0) {
            await register(data);
        } else {
            console.error('Validation errors:', errors);
            if (this.notification) {
                this.notification.showUp("Ошибка!", 'error');
            }
        }
    }

    render(): string {
        return `
            <div class="registration">
                {{{singlePage}}}
                <div class="notification-container">
                    {{{ notification }}}
                </div>
            </div>
        `;
    }
}
