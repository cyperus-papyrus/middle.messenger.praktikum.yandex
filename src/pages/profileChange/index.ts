import Block from '../../framework/Block';
import SinglePage from '../../components/singlepage/singlepage';
import Field from '../../components/field/field';
import Button, { BackButton } from '../../components/button/button';
import Notification from '../../components/notification/notification';
import AvatarUpload from '../../components/avatarUpload/avatarUpload';
import { validateForm } from '../../utils/validation';
import { update, updateAvatar } from '../../actions/user';
import Store from '../../framework/Store';
import { User } from '../../utils/types';

export default class ProfileChangePage extends Block {
    private notification?: Notification;
    private avatarUpload?: AvatarUpload;

    constructor() {
        let state = Store.getState();
        let user = state.user as User;

        const userData = {
            first_name: user.first_name || '',
            second_name: user.second_name || '',
            display_name: user.display_name || '',
            login: user.login || '',
            email: user.email || '',
            phone: user.phone || ''
        };

        const handleAvatarSelected = async (file: File) => {
            try {
                await updateAvatar(file);
                state = Store.getState();
                user = state.user as User;
                this.avatarUpload?.updateAvatar(user.avatar);

                if (this.notification) {
                    this.notification.showUp("Аватар успешно обновлен!", 'success');
                }
            } catch (error) {
                console.error('Avatar upload failed:', error);
                if (this.notification) {
                    this.notification.showUp("Ошибка при загрузке аватара", 'error');
                }
            }
        };

        const avatarUpload = new AvatarUpload({
            currentAvatar: user.avatar || '',
            onAvatarSelected: handleAvatarSelected
        });

        const fieldComponents = [
            new Field({
                id: 'inputName',
                name: 'first_name',
                type: 'text',
                placeholder: 'Имя',
                value: userData.first_name
            }),
            new Field({
                id: 'inputSecondName',
                name: 'second_name',
                type: 'text',
                placeholder: 'Фамилия',
                value: userData.second_name
            }),
            new Field({
                id: 'inputDisplayName',
                name: 'display_name',
                type: 'text',
                placeholder: 'Отображаемое имя',
                value: userData.display_name
            }),
            new Field({
                id: 'inputLogin',
                name: 'login',
                type: 'text',
                placeholder: 'Логин',
                value: userData.login
            }),
            new Field({
                id: 'inputEmail',
                name: 'email',
                type: 'email',
                placeholder: 'Электронная почта',
                value: userData.email
            }),
            new Field({
                id: 'inputPhone',
                name: 'phone',
                type: 'tel',
                placeholder: 'Телефон',
                value: userData.phone
            }),
            new Button({
                id: 'btnSave',
                className: 'button-blue',
                text: 'Сохранить',
                type: 'submit'
            })
        ];

        const bodyComponents = [
            avatarUpload,
            ...fieldComponents
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
            form: true,
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
        this.avatarUpload = avatarUpload;
        this.notification = notification;
    }

    async handleSubmit(e: Event) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            first_name: formData.get('first_name') as string,
            second_name: formData.get('second_name') as string,
            display_name: formData.get('display_name') as string,
            login: formData.get('login') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string
        };

        const errors = validateForm(data);

        if (Object.keys(errors).length === 0) {
            try {
                await update(data);

                if (this.notification) {
                    this.notification.showUp("Данные успешно обновлены!", 'success');
                }
            } catch (error) {
                console.error('Update failed:', error);
                if (this.notification) {
                    this.notification.showUp("Ошибка при обновлении данных", 'error');
                }
            }
        } else {
            if (this.notification) {
                this.notification.showUp("Ошибка при обновлении данных!", 'error');
            }
        }
    }

    render(): string {
        return `
            <div class="profile profile-change">
                {{{singlePage}}}
                <div class="notification-container">
                    {{{ notification }}}
                </div>
            </div>
        `;
    }
}
