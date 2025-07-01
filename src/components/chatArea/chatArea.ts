import Block from "../../framework/Block";
import MessageList from "../messageList/messageList";
import ChatSend from "../chatSend/chatSend";
import { IBlockProps, MessageForDisplay } from "../../utils/types";

interface ChatAreaProps extends IBlockProps {
    title: string;
    messages: MessageForDisplay[];
    chatSend: ChatSend;
    chatActions: Block;
    isActive: boolean;
}

export default class ChatArea extends Block<ChatAreaProps> {
    constructor(props: ChatAreaProps) {
        super(props);

        this.children.messageList = new MessageList({
            messages: props.messages || []
        });

        this.children.chatActions = props.chatActions;
    }

    protected componentDidUpdate(oldProps: ChatAreaProps, newProps: ChatAreaProps): boolean {
        if (oldProps.messages !== newProps.messages) {
            this.children.messageList.setProps({
                messages: newProps.messages
            });
        }

        if (oldProps.chatActions !== newProps.chatActions) {
            this.children.chatActions = newProps.chatActions;
        }

        return oldProps.title !== newProps.title ||
            oldProps.isActive !== newProps.isActive ||
            oldProps.chatActions !== newProps.chatActions;
    }

    render() {
        if (!this.props.isActive) {
            return `
                <div class="home__chat-area">
                    <p><b>Выберите чат, чтобы начать общение</b></p>
                </div>
            `;
        }
        return `
            <div class="home__chat-area">
                <header class="chat-area__header">
                    {{ title }}
                    {{{ chatActions }}}
                </header>
                {{{ messageList }}}
                <div class="chat-area__send">
                    {{{ chatSend }}}
                </div>
            </div>
        `;
    }
}
