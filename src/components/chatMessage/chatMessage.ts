import Block from '../../framework/Block';

interface IChatMessageProps {
    text: string;
    time: string;
    isRead: boolean;
    isMine: boolean;
    [key: string]: unknown;
}

export default class ChatMessage extends Block<IChatMessageProps> {
    constructor(props: IChatMessageProps) {
        super(props);
    }

    getMessageClasses(): string {
        const classes = ['chat-message'];
        if (this.props.isMine) classes.push('chat-message--mine');
        return classes.join(' ');
    }

    getStatusIcon(): string { return this.props.isRead ? '✓✓' : ''; }

    render() {
        const classes = this.getMessageClasses();

        return `
            <div class="${classes}">
                <div class="chat-message__content">
                    <p class="chat-message__text">${this.props.text}</p>
                    <div class="chat-message__info">
                        <span class="chat-message__time">${this.props.time}</span>
                        ${this.props.isMine ?
                `<span class="chat-message__status">${this.getStatusIcon()}</span>` :
                ''}
                    </div>
                </div>
            </div>
        `;
    }
}
