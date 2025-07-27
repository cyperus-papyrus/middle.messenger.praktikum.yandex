import Block from '../../framework/Block';
import Button from '../button/button';
import DropdownMenu from '../dropdownMenu/dropdownMenu';
import { IBlockProps } from '../../utils/types';
import {
    getChatUsers,
    addUsersToChat,
    removeUsersFromChat,
    deleteChat
} from '../../actions/chat';
import { searchUsersByLogin } from '../../actions/user';


interface ChatActionsProps extends IBlockProps {
    currentChatId: number | null;
    currentUserId: number;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
    onConfirm: (message: string, callback: () => void) => void;
    onUserListRequested: (users: string[]) => void;
    onPrompt: (
        title: string,
        callback: (value: string) => void
    ) => void;
    onConfirmModal: (
        message: string,
        confirmCallback: () => void
    ) => void;
}

interface ChatActionsState {
    isMenuOpen: boolean;
}

export default class ChatActions extends Block<ChatActionsProps> {
    state: ChatActionsState = {
        isMenuOpen: false
    };

    constructor(props: ChatActionsProps) {
        const menuItems = [
            new Button({
                className: 'button-menu-item',
                icon: 'Edit',
                text: 'Добавить участника',
                events: {
                    click: () => this.handleAddUser()
                }
            }),
            new Button({
                className: 'button-menu-item',
                icon: 'Close',
                text: 'Удалить участника',
                events: {
                    click: () => this.handleRemoveUser()
                }
            }),
            new Button({
                className: 'button-menu-item',
                icon: 'Eye',
                text: 'Список участников',
                events: {
                    click: () => this.handleShowUsers()
                }
            }),
            new Button({
                className: 'button-menu-item button-menu-item--danger',
                text: 'Удалить чат',
                events: {
                    click: () => this.handleDeleteChat()
                }
            })
        ];
        const toggleButton = new Button({
            className: 'button-primary',
            icon: 'Menu'
        });
        const dropdownMenu = new DropdownMenu({
            isOpen: false,
            toggleButton: toggleButton,
            items: menuItems,
            position: 'right'
        });

        super({
            ...props,
            dropdownMenu
        });
    }

    toggleMenu() {
        this.setProps({ isMenuOpen: !this.state.isMenuOpen });
    }


    private async handleDeleteChat() {
        const { currentChatId, onConfirmModal, onSuccess, onError } = this.props;
        if (!currentChatId) return;

        onConfirmModal('', async () => {
            try {
                const success = await deleteChat(currentChatId);
                if (success) {
                    onSuccess('Чат успешно удален');
                } else {
                    onError('Не удалось удалить чат');
                }
            } catch (error) {
                console.error('Ошибка при удалении чата:', error);
                onError('Произошла ошибка при удалении чата');
            }
        });
    }
    private async handleAddUser() {
        const { currentChatId, onPrompt, onSuccess, onError } = this.props;
        if (!currentChatId) return;

        onPrompt(
            'Добавить участника',
            async (login) => {
                try {
                    const users = await searchUsersByLogin(login);
                    if (users.length === 0) {
                        onError('Пользователь не найден');
                        return;
                    }

                    const user = users[0];
                    const success = await addUsersToChat(currentChatId, [user.id]);

                    if (success) {
                        onSuccess(`Пользователь ${user.login} добавлен`);
                    } else {
                        onError('Ошибка при добавлении');
                    }
                } catch (error) {
                    console.error('Ошибка при добавлении пользователя:', error);
                    onError('Произошла ошибка');
                }
            }
        );
    }

    private async handleRemoveUser() {
        const { currentChatId, onPrompt, onSuccess, onError } = this.props;
        if (!currentChatId) return;

        onPrompt(
            'Удалить участника',
            async (login) => {
                try {
                    const usersResponse = await getChatUsers(currentChatId);
                    if (!Array.isArray(usersResponse)) {
                        throw new Error('Неверный формат ответа');
                    }

                    const userToRemove = usersResponse.find(user => user.login === login);
                    if (!userToRemove) {
                        onError('Пользователь не найден в чате');
                        return;
                    }

                    const success = await removeUsersFromChat(currentChatId, [userToRemove.id]);
                    if (success) {
                        onSuccess(`Пользователь ${userToRemove.login} удален`);
                    } else {
                        onError('Ошибка при удалении');
                    }
                } catch (error) {
                    console.error('Ошибка при удалении пользователя:', error);
                    onError('Произошла ошибка');
                }
            }
        );
    }

    private async handleShowUsers() {
        const { currentChatId, onUserListRequested, onError } = this.props;
        if (!currentChatId) return;

        try {
            const usersResponse = await getChatUsers(currentChatId);
            if (!Array.isArray(usersResponse)) {
                throw new Error('Неверный формат ответа');
            }

            const userList = usersResponse.map(user =>
                `${user.login} (${user.first_name} ${user.second_name})`
            );

            onUserListRequested(userList);
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            onError('Не удалось получить список пользователей');
        }
    }

    render() {
        return `
            <div class="chat-actions">
                {{{ dropdownMenu }}}
            </div>
        `;
    }
}
