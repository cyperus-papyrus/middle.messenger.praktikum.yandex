import Block from '../../framework/Block';
import Link from '../../components/link/link';
import Field from '../../components/field/field';
import Modal from '../../components/modal/modal';
import Notification from '../../components/notification/notification';
import ChatSend from '../../components/chatSend/chatSend';
import Store, { StoreEvents } from '../../framework/Store';
import {
    createChat,
    fetchChats, getToken
} from '../../actions/chat';
import { MessageForDisplay, User, AppState } from '../../utils/types';
import { IBlockProps } from '../../utils/types';
import WebSocketService from '../../framework/WebSocket';
import { setMessages, addMessage } from '../../actions/messages';

import ChatList from '../../components/chatList/chatList';
import ChatArea from '../../components/chatArea/chatArea';
import ChatActions from '../../components/chatActions/chatActions';
import { ChatInfo } from '../../utils/types';

import { isEmpty, isEqual } from '../../utils/helpers';

interface HomePageProps extends IBlockProps {
    name: string;
    profileLink: Link;
    searchField: Field;
    currentChatId?: number | null;
    chats?: ChatInfo[];
    onConfirm?: () => void
}


export default class HomePage extends Block<HomePageProps> {
    private _onStoreChange: () => void;
    private socketService: WebSocketService | null = null;
    private modal: Modal | null = null;
    private notification: Notification | null = null;

    constructor() {
        const profileLink = new Link({
            text: 'Профиль',
            icon: 'ArrowRight',
            url: 'settings',
            className: 'link'
        });

        const searchField = new Field({
            id: 'search',
            type: 'text',
            placeholder: 'Поиск',
            name: 'search',
            className: 'input-search'
        });
        const chatActions = new ChatActions({
            currentChatId: null,
            currentUserId: 0,
            onError: (message) => this.notification?.showUp(message),
            onSuccess: (message) => this.notification?.showUp(message),
            onConfirm: (message, callback) => {
                if (confirm(message)) callback();
            },
            onUserListRequested: (users) => {
                this.modal?.showModal(
                    'Участники чата',
                    `<div class="list">${users.map(u => `<p>${u}</p>`).join('')}</div>`
                );
            },

            onPrompt: (title, callback) => {
                this.modal?.showModalWithInput(
                    title,
                    'modalLogin',
                    (value) => {
                        if (value) callback(value);
                    }
                );
            },
            onConfirmModal: (message, confirmCallback) => {
                this.modal?.showModal(
                    'Вы уверены, что хотите удалить чат?',
                    message,
                    () => {
                        confirmCallback();
                    }
                );
            }
        });

        const chatList = new ChatList({
            chats: [],
            currentChatId: null,
            onCreateChat: () => {
                this.modal?.showModalWithInput("Введите название чата", 'modalChatname',
                    (title) => {
                        if (!title) return;
                        createChat(title);
                    }
                )
            },
            onSelectChat: (id: number) => {
                Store.set("currentChatId", id);
            },
        });

        const chatSend = new ChatSend({
            onSubmit: (message: string) => this.sendMessage(message)
        });
        const chatArea = new ChatArea({
            title: "Гость",
            messages: [],
            chatSend: chatSend,
            chatActions: chatActions,
            isActive: false
        });
        const modal = new Modal({
            title: '',
            content: '',
            visible: false
        });
        const notification = new Notification({
            visible: false,
            message: ""
        })
        const initialState: HomePageProps = {
            name: 'Гость',
            profileLink,
            searchField,
            currentChatId: null,
            chats: [],
        };

        super(initialState);

        this.children = {
            chatArea,
            chatList,
            chatSend,
            profileLink,
            searchField,
            chatActions,
            modal,
            notification
        };

        this.modal = modal;
        this.notification = notification;
        this._onStoreChange = this._updateStateFromStore.bind(this);
        Store.on(StoreEvents.Updated, this._onStoreChange);
        fetchChats();
    }

    private normalizeMessage(data: unknown): MessageForDisplay | null {
        if (typeof data !== 'object' || data === null) {
            return null;
        }

        const dataObj = data as Record<string, unknown>;
        const userId = (Store.getState().user as User | null)?.id;
        return {
            id: typeof dataObj.id === 'number' ? dataObj.id : 0,
            time: typeof dataObj.time === 'string' ? dataObj.time : '',
            text: typeof dataObj.content === 'string' ? dataObj.content : '',
            isMine: typeof dataObj.user_id === 'number' && dataObj.user_id === userId,
            isRead: true,
            type: 'message'
        };
    }
    private async initSocketService(chatId: number) {
        if (this.socketService) {
            this.socketService.close();
            this.socketService = null;
        }

        try {
            const tokenResponse = await getToken(chatId);
            if (!tokenResponse || typeof tokenResponse !== 'object' || !tokenResponse.token) {
                throw new Error('Invalid token response format');
            }

            const token = tokenResponse.token;
            const userId = (Store.getState().user as User | null)?.id;

            if (!userId) {
                throw new Error('User ID not found');
            }

            const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
            this.socketService = new WebSocketService(wsUrl, {
                onOpen: () => {
                    setTimeout(() => this.loadMessageHistory(0), 100);
                },
                onClose: () => {
                    console.log('WebSocket connection closed');
                },
                onError: (event) => {
                    console.error('WebSocket error:', event);
                }
            });

            this.socketService.addMessageListener(this.handleSocketMessage.bind(this));
        } catch (error) {
            console.error('Ошибка инициализации WebSocket:', error);
        }
    }

    private handleSocketMessage(data: unknown) {
        const state = Store.getState() as AppState;
        const chatId = state.currentChatId;
        if (!chatId) return;

        if (Array.isArray(data)) {
            const messages = data
                .map(item => this.normalizeMessage(item))
                .filter((msg): msg is MessageForDisplay => msg !== null);
            setMessages(chatId, messages);
        } else if (
            typeof data === 'object' &&
            data !== null &&
            'type' in data
        ) {
            const messageType = (data as { type: string }).type;

            if (messageType === 'message') {
                const message = this.normalizeMessage(data);
                if (message) {
                    addMessage(chatId, message);
                }
            } else if (messageType === 'pong') {
                console.log('Received pong');
            } else if (messageType === 'error') {
                console.error('WebSocket error message:', data);
            }
        }
    }

    private loadMessageHistory(offset: number) {
        if (this.socketService) {
            this.socketService.send({
                type: 'get old',
                content: String(offset)
            });
        }
    }

    private sendMessage(content: string) {
        if (this.socketService) {
            this.socketService.send({
                type: 'message',
                content
            });
        }
    }

    private _updateStateFromStore() {
        const state = Store.getState() as AppState;
        const prevProps = this.props;
        const currentChats = state.chats || [];
        const prevChats = prevProps.chats || [];
        const user = state.user;

        const chatsChanged = !isEqual(currentChats, prevChats);
        const chatIdChanged = state.currentChatId !== prevProps.currentChatId;

        if (isEmpty(currentChats) && isEmpty(prevChats) && !chatIdChanged) {
            return;
        }

        const chats = state.chats || [];
        const currentChatId = state.currentChatId;
        const validCurrentChatId = currentChatId &&
            chats.some(chat => chat.id === currentChatId) ?
            currentChatId :
            null;
        if (chatIdChanged) {
            if (validCurrentChatId !== this.props.currentChatId) {
                if (validCurrentChatId) {
                    this.initSocketService(validCurrentChatId);
                } else if (this.socketService) {
                    this.socketService.close();
                    this.socketService = null;
                }
            }
        }
        const messages = validCurrentChatId ?
            (state.messages?.[validCurrentChatId] || []) :
            [];
        if (chatsChanged || chatIdChanged) {
            this.children.chatActions.setProps({
                currentChatId: validCurrentChatId
            });
            this.children.chatArea.setProps({
                title: user?.display_name || user?.first_name || "Гость",
                messages,
                isActive: !!validCurrentChatId,
                chatActions: this.children.chatActions
            });

            this.children.chatList.setProps({
                chats: chats,
                currentChatId: validCurrentChatId
            });

            this.setProps({
                name: user?.display_name || user?.first_name || 'Гость',
                currentChatId: validCurrentChatId
            });
        }
    }

    componentWillUnmount() {
        if (this.socketService) {
            this.socketService.close();
            this.socketService.removeAllListeners();
        }
        Store.off(StoreEvents.Updated, this._onStoreChange);
    }

    render(): string {
        return `
            <div class="home">
                <aside class="home__chat-menu">
                    {{{profileLink}}}
                    {{{searchField}}}
                    {{{chatList}}}
                </aside>
                {{{chatArea}}}
                {{{ modal }}}
                {{{notification}}}
            </div>
        `;
    }
}
