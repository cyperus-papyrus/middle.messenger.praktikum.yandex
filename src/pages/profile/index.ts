import Block from '../../framework/Block';
import SinglePage from '../../components/singlepage/singlepage';
import Avatar from '../../components/avatar/avatar';
import Button, { BackButton } from '../../components/button/button';
import Link from '../../components/link/link';
import { createStaticBlock } from '../../components/helpers/createStaticBlock';
import Store from '../../framework/Store';
import { User } from '../../utils/types';

import { logout } from '../../actions/auth';
import Router from '../../framework/Router';

interface UserDataItem {
    label: string;
    value: string;
}

export default class ProfilePage extends Block {
    constructor() {
        const state = Store.getState();
        const user = state.user as User;
        const userData: UserDataItem[] = [
            { label: 'Имя', value: user.first_name },
            { label: 'Фамилия', value: user.second_name },
            { label: 'Логин', value: user.login },
            { label: 'Почта', value: user.email },
            { label: 'Имя в чате', value: user.display_name || user.login },
            { label: 'Телефон', value: user.phone }
        ];

        const changePasswordLink = new Link({
            text: 'Хотите сменить пароль?',
            url: 'settings-change-pass',
            className: 'link',
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
                src: user.avatar,
                alt: 'Аватар пользователя',
                className: 'profile__avatar'
            }),

            new StaticUserDataBlock()
        ];

        const footerComponents = [
            new Link({
                id: 'btnChangeProfile',
                className: 'button button-secondary',
                text: 'Изменить данные',
                url: '/settings-change'
            }),
            new Button({
                id: 'btnLogOut',
                className: 'button button-red',
                text: 'Выйти из системы',
                events: {
                    click: () => this.logout()
                }
            })
        ];

        const backButton = new BackButton({
            className: 'button-secondary',
            icon: 'ArrowBack'
        });

        const singlePage = new SinglePage({
            className: 'singlePage-profile',
            title: 'Профиль',
            backButton: backButton,
            bodyContent: bodyComponents,
            footerContent: footerComponents
        });

        super({ singlePage });
    }

    logout() {
        logout().then(() => {
            Router.getInstance().go('/');
        });
    }

    render(): string {
        return `
            <div class="profile">
                {{{singlePage}}}
            </div>
        `;
    }
}
