import ChatAPI from '../api/chat-api';
import Store from '../framework/Store';

export const fetchChats = async () => {
    try {
        const chats = await ChatAPI.getChats();
        Store.set('chats', chats);
    } catch (error) {
        console.error('Ошибка получения чатов:', error);
    }
};

export const createChat = async (title: string) => {
    try {
        await ChatAPI.createChat(title);
        await fetchChats();
    } catch (error) {
        console.error('Ошибка создания чата:', error);
    }
};

export const deleteChat = async (chatId: number) => {
    try {
        await ChatAPI.deleteChat(chatId);
        await fetchChats();
        Store.set('currentChatId', null);
        return true;
    } catch (error) {
        console.error('Ошибка удаления чата:', error);
        return false;
    }
};

export const addUsersToChat = async (chatId: number, userIds: number[]) => {
    try {
        await ChatAPI.addUsersToChat(chatId, userIds);
        return true;
    } catch (error) {
        console.error('Ошибка добавления пользователей в чат:', error);
        return false;
    }
};

export const removeUsersFromChat = async (chatId: number, userIds: number[]) => {
    try {
        await ChatAPI.removeUsersFromChat(chatId, userIds);
        return true;
    } catch (error) {
        console.error('Ошибка удаления пользователей из чата:', error);
        return false;
    }
};

export const getChatUsers = async (chatId: number) => {
    try {
        return await ChatAPI.getChatUsers(chatId);
    } catch (error) {
        console.error('Ошибка получения пользователей чата:', error);
        return false;
    }
};

export const getToken = async (chatId: number) => {
    try {
        return await ChatAPI.getToken(chatId) as { token: string };
    } catch (error) {
        console.error('Ошибка получения токена:', error);
        throw error;
    }
};
