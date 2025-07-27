import HTTPTransport from '../utils/HTTPTransport';
import BaseAPI from './base-api';

const authBaseUrl = '/auth';

class AuthAPI extends BaseAPI {
    private http: HTTPTransport;

    constructor() {
        super();
        this.http = new HTTPTransport(authBaseUrl);
    }

    signin(data: { login: string; password: string }) {
        return this.http.post('/signin', data);
    }

    signup(data: {
        first_name: string;
        second_name: string;
        login: string;
        email: string;
        password: string;
        phone: string;
    }) {
        return this.http.post('/signup', data);
    }

    logout() {
        return this.http.post('/logout');
    }

    getUser() {
        return this.http.get('/user');
    }
}

export default new AuthAPI();
