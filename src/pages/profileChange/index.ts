import Block from '../../framework/Block';
import Modal from '../../components/modal/modal';
import Avatar from '../../components/avatar/avatar';
import Icon from '../../components/icon/icon';
import Field from '../../components/field/field';
import Button from '../../components/button/button';
import { createStaticBlock } from '../../components/helpers/createStaticBlock';
import { validateForm } from '../../utils/validation';

export default class ProfileChangePage extends Block {
    constructor() {
        const avatarChangeBlock = createStaticBlock(`
            <div class="avatar profile__avatar">
            <a href="#" class="profile__avatar-change">
                {{{avatar}}}
                <div class="profile__avatar-overlay">
                    {{{editIcon}}}
                </div>
            </a>
            </div>
        `, {
            avatar: new Avatar({ name: 'Avatar.svg' }),
            editIcon: new Icon({ name: 'Edit' })
        });

        const fieldComponents = [
            new Field({
                id: 'inputName',
                name: 'first_name',
                type: 'text',
                placeholder: 'Имя'
            }),
            new Field({
                id: 'inputSecondName',
                name: 'second_name',
                type: 'text',
                placeholder: 'Фамилия'
            }),
            new Field({
                id: 'inputDisplayName',
                name: 'display_name',
                type: 'text',
                placeholder: 'Отображаемое имя'
            }),
            new Field({
                id: 'inputLogin',
                name: 'login',
                type: 'text',
                placeholder: 'Логин'
            }),
            new Field({
                id: 'inputEmail',
                name: 'email',
                type: 'email',
                placeholder: 'Электронная почта'
            }),
            new Field({
                id: 'inputPhone',
                name: 'phone',
                type: 'tel',
                placeholder: 'Телефон'
            }),
            new Button({
                id: 'btnSave',
                className: 'button-blue',
                text: 'Сохранить',
                type: 'submit'
            })
        ];

        const bodyComponents = [
            new avatarChangeBlock(),
            ...fieldComponents
        ];

        const backButton = new Button({
            className: 'button-secondary',
            icon: 'ArrowBack',
            events: {
                click: (e) => {
                    e.preventDefault();
                    console.log('Back button clicked');
                }
            }
        });

        const modal = new Modal({
            className: 'modal-profile',
            title: 'Профиль',
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
