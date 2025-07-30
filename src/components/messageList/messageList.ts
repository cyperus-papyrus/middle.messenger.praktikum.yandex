import Block from "../../framework/Block";
import ChatMessage from "../chatMessage/chatMessage";
import { MessageForDisplay } from "../../utils/types";
import { formatTime } from "../../utils/helpers";
import { IBlockProps } from "../../utils/types";

interface MessageListProps extends IBlockProps {
    messages: MessageForDisplay[];
}

export default class MessageList extends Block<MessageListProps> {
    constructor(props: MessageListProps) {
        super(props);
        this.lists.messages = this.createMessages();
    }

    protected componentDidUpdate(oldProps: MessageListProps, newProps: MessageListProps): boolean {
        if (oldProps.messages !== newProps.messages) {
            this.lists.messages = this.createMessages(newProps.messages);
            return true;
        }
        return false;
    }

    private createMessages(messages = this.props.messages) {
        if (!messages || messages.length === 0) {
            return [];
        }
        return (this.props.messages || []).map(message => new ChatMessage({
            text: message.text,
            time: formatTime(message.time),
            isMine: message.isMine,
            isRead: message.isRead,
            type: message.type
        }));
    }

    render() {
        return `

                <section class="chat-area__messages">
                {{{ messages }}}
                </section>
        `;
    }
}
