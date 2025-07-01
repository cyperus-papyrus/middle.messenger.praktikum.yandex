import Block from '../../framework/Block';
import Modal from '../../components/modal/modal';
import Field from '../../components/field/field';
import Button from '../../components/button/button';
import Link from '../../components/link/link';
import { validateForm } from '../../utils/validation';

export default class RegistrationPage extends Block {
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

        const footerComponents = [
            new Link({
                text: 'Нет аккаунта?',
                url: '#'
            })
        ];

        const modal = new Modal({
            className: 'modal-registration',
            title: 'Регистрация',
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
            <div class="registration">
                {{{modal}}}
            </div>
        `;
    }
}
