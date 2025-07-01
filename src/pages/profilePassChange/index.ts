import Block from '../../framework/Block';
import SinglePage from '../../components/singlepage/singlepage';
import Field from '../../components/field/field';
import Button, { BackButton } from '../../components/button/button';
import Notification from '../../components/notification/notification';
import { validateForm } from '../../utils/validation';
import { updatePassword } from '../../actions/user';


export default class ProfilePassChangePage extends Block {
    private notification?: Notification;
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

        const backButton = new BackButton({
            className: 'button-secondary',
            icon: 'ArrowBack'
        });

        const singlePage = new SinglePage({
            className: 'singlePage-profile',
            title: 'Сброс пароля',
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

        super({ notification, singlePage });
        this.notification = notification;
    }

    async handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            oldPassword: formData.get('oldPassword') as string,
            newPassword: formData.get('newPassword') as string
        };

        const errors = validateForm(data);

        if (Object.keys(errors).length === 0) {
            try {
                await updatePassword(data);
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
            console.error('Validation errors:', errors);
            if (this.notification) {
                this.notification.showUp("Ошибка при обновлении данных!", 'error');
            }
        }
    }

    render(): string {
        return `
            <div class="profile">
                {{{singlePage}}}
                <div class="notification-container">
                    {{{ notification }}}
                </div>
            </div>
        `;
    }
}
