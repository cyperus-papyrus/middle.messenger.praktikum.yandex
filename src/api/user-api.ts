import HTTPTransport from '../utils/HTTPTransport';
import BaseAPI from './base-api';
import { User } from '../utils/types';

const userBaseUrl = '/user';

class UserAPI extends BaseAPI {
    private http: HTTPTransport;

    constructor() {
        super();
        this.http = new HTTPTransport(userBaseUrl);
    }

    updateProfile(data: {
        first_name: string;
        second_name: string;
        display_name: string;
        login: string;
        email: string;
        phone: string;
    }) {
        return this.http.put('/profile', data);
    }

    updateAvatar(data: FormData) {
        return this.http.put('/profile/avatar', data);
    }

    updatePassword(data: { oldPassword: string; newPassword: string }) {
        return this.http.put('/password', data);
    }

    searchUser(login: string): Promise<User[]> {
        return this.http.post('/search', { login });
    }

    getUserById(id: number) {
        return this.http.get(`/${id}`);
    }
}

export default new UserAPI();
