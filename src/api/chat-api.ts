import HTTPTransport from '../utils/HTTPTransport';
import BaseAPI from './base-api';
import { User } from '../utils/types';
const chatBaseUrl = '/chats';

class ChatAPI extends BaseAPI {
    private http: HTTPTransport;

    constructor() {
        super();
        this.http = new HTTPTransport(chatBaseUrl);
    }

    getChats() {
        return this.http.get('');
    }

    createChat(title: string) {
        return this.http.post('', { title });
    }

    deleteChat(chatId: number) {
        return this.http.delete('', { chatId });
    }

    getChatUsers(chatId: number): Promise<User[]> {
        return this.http.get(`/${chatId}/users`);
    }

    addUsersToChat(chatId: number, userIds: number[]) {
        return this.http.put('/users', { chatId, users: userIds });
    }

    removeUsersFromChat(chatId: number, userIds: number[]) {
        return this.http.delete('/users', { chatId, users: userIds });
    }

    getNewMessagesCount(chatId: number) {
        return this.http.get(`/new/${chatId}`);
    }

    updateChatAvatar(data: FormData) {
        return this.http.put('/avatar', data);
    }

    getToken(chatId: number) {
        return this.http.post(`/token/${chatId}`);
    }
}

export default new ChatAPI();
