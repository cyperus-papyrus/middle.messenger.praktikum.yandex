export type Nullable<T> = T | null;

export type BlockEvent = (e: Event) => void;

export interface IBlockEvents {
    [key: string]: BlockEvent;
}

export interface IBlockProps {
    events?: IBlockEvents;
    attr?: Record<string, string | boolean | number>;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    second_name: string;
    display_name: string | null;
    login: string;
    email: string;
    phone: string;
    avatar?: string;
    role?: string;
}

export type LastMessageUser = {
    first_name: string;
    second_name: string;
    avatar: string;
    email: string;
    login: string;
    phone: string;
};

export type LastMessage = {
    user: LastMessageUser;
    time: string;
    content: string;
};

export type ChatInfo = {
    id: number;
    title: string;
    avatar: string | null;
    unread_count: number;
    created_by: number;
    last_message: LastMessage | null;
};

export type Message = {
    id: number;
    time: string;
    user_id: number;
    content: string;
    type: 'message' | 'file';
    file?: {
        id: number;
        user_id: number;
        path: string;
        filename: string;
        content_type: string;
        content_size: number;
        upload_date: string;
    };
};

export type MessageForDisplay = {
    id: number;
    time: string;
    text: string;
    isMine: boolean;
    isRead: boolean;
    type: 'message' | 'file';
    file?: {
        path: string;
        filename: string;
        contentType: string;
    };
};

export interface AppState {
    user?: User | null;
    chats?: ChatInfo[];
    currentChatId?: number | null;
    messages?: {
        [chatId: number]: MessageForDisplay[];
    };
}
