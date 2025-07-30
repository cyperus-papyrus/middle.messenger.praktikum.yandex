import Store from '../framework/Store';
import { AppState, MessageForDisplay } from '../utils/types';

export const setMessages = (chatId: number, messages: MessageForDisplay[]) => {
    Store.set(`messages.${chatId}`, messages);
};

export const addMessage = (chatId: number, message: MessageForDisplay) => {
    const state = Store.getState() as AppState;
    const messages = state.messages?.[chatId] || [];

    const currentChatId = state.currentChatId;
    if (chatId !== currentChatId) {
        const chats = state.chats?.map(chat =>
            chat.id === chatId
                ? { ...chat, unread_count: (chat.unread_count || 0) + 1 }
                : chat) || [];
        Store.set('chats', chats);
    }

    Store.set(`messages.${chatId}`, [message, ...messages]);
};

export const clearMessages = (chatId: number) => {
    Store.set(`messages.${chatId}`, []);
};
