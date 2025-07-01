import Block from '../../framework/Block';
import Modal from '../../components/modal/modal';
import Avatar from '../../components/avatar/avatar';
import Button from '../../components/button/button';
import Link from '../../components/link/link';
import { createStaticBlock } from '../../components/helpers/createStaticBlock';

interface UserDataItem {
    label: string;
    value: string;
}

export default class ProfilePage extends Block {
    constructor() {
        const userData: UserDataItem[] = [
            { label: 'Имя', value: 'Иван' },
            { label: 'Фамилия', value: 'Иванов' },
            { label: 'Логин', value: 'ivanivanov' },
            { label: 'Почта', value: 'pochta@yandex.ru' },
            { label: 'Имя в чате', value: 'Иван' },
            { label: 'Телефон', value: '8 (800) 555-35-35' }
        ];

        const changePasswordLink = new Link({
            text: 'Хотите сменить пароль?',
            url: '#'
        });

        const userDataHTML = `
            <div class="profile__userData">
                ${userData.map(item => `
                    <div class="profile__userData-line">
                        <span class="profile__label">${item.label}</span>
                        <span class="profile__value">${item.value}</span>
                    </div>
                `).join('')}
                <div class="profile__userData-line profile__userData-link">
                    {{{changePasswordLink}}}
                </div>
            </div>
        `;

        const StaticUserDataBlock = createStaticBlock(userDataHTML, {
            changePasswordLink
        });

        const bodyComponents = [
            new Avatar({
                name: 'Avatar.svg',
                alt: 'Аватар пользователя',
                className: 'profile__avatar'
            }),

            new StaticUserDataBlock()
        ];

        const footerComponents = [
            new Button({
                id: 'btnChangeProfile',
                className: 'button-secondary',
                text: 'Изменить данные',
                events: {
                    click: (e) => {
                        e.preventDefault();
                        console.log('Change data, please');
                    }
                }
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
            title: 'Профиль',
            backButton: backButton,
            bodyContent: bodyComponents,
            footerContent: footerComponents
        });

        super({ modal });
    }

    render(): string {
        return `
            <div class="profile">
                {{{modal}}}
            </div>
        `;
    }
}
