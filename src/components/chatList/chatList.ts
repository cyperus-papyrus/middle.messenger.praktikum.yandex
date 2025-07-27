import Block from "../../framework/Block";
import ChatBlock from "../chatBlock/chatBlock";
import Button from "../button/button";
import { ChatInfo } from "../../utils/types";
import { formatTime } from "../../utils/helpers";
import { IBlockProps } from "../../utils/types";

interface ChatListProps extends IBlockProps {
    chats: ChatInfo[];
    currentChatId: number | null;
    onCreateChat: () => void;
    onSelectChat: (id: number) => void;
}

export default class ChatList extends Block<ChatListProps> {
    protected ignoreLists = ['chats'];

    constructor(props: ChatListProps) {
        super({
            ...props,
            onCreateChatButton: new Button({
                text: "Создать чат",
                className: "button-primary",
                events: {
                    click: () => props.onCreateChat(),
                },
            }),
        });
        this.lists.chatBlocks = []
    }
    protected componentDidUpdate(oldProps: ChatListProps, newProps: ChatListProps): boolean {
        if (oldProps.chats !== newProps.chats
            || oldProps.currentChatId !== newProps.currentChatId) {
            this.lists.chatBlocks = this.createChatBlocks();
        }
        return true;
    }

    private createChatBlocks() {
        const chats = this.props.chats || [];
        return chats.map(chat =>
            new ChatBlock({
                id: chat.id,
                name: chat.title,
                time: chat.last_message ? formatTime(chat.last_message.time) : "",
                lastMessage: chat.last_message?.content || "Нет сообщений",
                unread: chat.unread_count,
                avatar: chat.avatar || null,
                isSelected: chat.id === this.props.currentChatId,
                events: {
                    click: () => this.props.onSelectChat(chat.id),
                },
            })
        );
    }

    render(): string {
        return `
      <div class="chat-list">
        <div class="chat-list__actions">
          {{{ onCreateChatButton }}}
        </div>
        <div class="chat-list__items">
          {{{ chatBlocks }}}
        </div>
      </div>
    `;
    }
}
