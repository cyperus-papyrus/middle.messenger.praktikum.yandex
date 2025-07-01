import { userAPI } from '../api/index';
import { authAPI } from '../api/index';
import store from '../framework/Store';
import { User } from '../utils/types';

export const update = async (data: {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
}) => {
    try {
        await userAPI.updateProfile(data);
        const user = await authAPI.getUser();
        store.set('user', user);
        return true;
    } catch (error) {
        console.error('Update failed:', error);
        return false;
    }
};

export const updateAvatar = async (file: File) => {
    try {

        const formData = new FormData();
        formData.append('avatar', file);

        await userAPI.updateAvatar(formData);

        const user = await authAPI.getUser();
        store.set('user', user);
        return true;
    } catch (error) {
        console.error('Avatar update error:', error);
        return false;
    }
};

export const updatePassword = async (data: {
    oldPassword: string,
    newPassword: string
}) => {
    try {
        await userAPI.updatePassword(data);

        const user = await authAPI.getUser();
        store.set('user', user);
        return true;
    }
    catch (error) {
        console.error('Update password error: ', error);
        return false;
    }

}


export const searchUsersByLogin = async (login: string): Promise<User[]> => {
    try {
        const users = await userAPI.searchUser(login);
        return users as User[];
    } catch (error) {
        console.error('Ошибка поиска пользователей:', error);
        return [];
    }
};
