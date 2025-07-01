import Block from '../../framework/Block';
import Modal from '../../components/modal/modal';
import Field from '../../components/field/field';
import Button from '../../components/button/button';
import { validateForm } from '../../utils/validation';

export default class ProfilePassChangePage extends Block {
    constructor() {
        const bodyComponents = [
            new Field({
                id: 'inputPassOld',
                name: 'oldPassword',
                type: 'password',
                placeholder: 'Пароль'
            }),
            new Field({
                id: 'inputPassNew',
                name: 'newPassword',
                type: 'password',
                placeholder: 'Пароль (ещё раз)'
            }),
            new Button({
                id: 'btnSave',
                className: 'button-red',
                text: 'Сохранить',
                type: 'submit',
            })
        ];

        const backButton = new Button({
            className: 'button-secondary',
            icon: 'ArrowBack',
            events: {
                click: (e) => {
                    e.preventDefault();
                    console.log('Save password button clicked');
                }
            }
        });

        const modal = new Modal({
            className: 'modal-profile',
            title: 'Сброс пароля',
            backButton: backButton,
            bodyContent: bodyComponents,
            form: true,
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
            <div class="profile">
                {{{modal}}}
            </div>
        `;
    }
}
