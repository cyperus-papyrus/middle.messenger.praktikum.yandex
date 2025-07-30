import { authAPI } from '../api/index';
import store from '../framework/Store';

export const login = async (data: { login: string; password: string }) => {
    try {
        await authAPI.signin(data);
        const user = await authAPI.getUser();
        store.set('user', user);
        return true;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const register = async (data: {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}) => {
    try {
        await authAPI.signup(data);
        const user = await authAPI.getUser();
        store.set('user', user);
        return true;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
};

export const logout = async () => {
    try {
        await authAPI.logout();
        store.set('user', '');
        return true;
    } catch (error) {
        console.error('Log out failed: ', error);
        return false;
    }
}
