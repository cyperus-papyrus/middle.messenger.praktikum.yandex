import Block from '../../framework/Block';
import Avatar from '../avatar/avatar';

interface IChatBlockProps {
    name: string;
    time: string;
    message: string;
    unread?: number;
    [key: string]: unknown;
}

export default class ChatBlock extends Block<IChatBlockProps> {
    constructor(props: IChatBlockProps) {
        const avatar = new Avatar({
            className: 'chat__chatblock-avatar',
            alt: props.name,
        });

        super({
            ...props,
            avatar
        });
    }

    render() {
        return `
            <div class="chat__chatblock">
                {{{avatar}}}
                <div class="chat__chatblock-info">
                    <div class="chat__chatblock-header">
                        <span class="chat__chatblock-name">${this.props.name}</span>
                        <p class="chat__chatblock-message">${this.props.message}</p>
                        </div>
                        <div class="chat__chatblock-content">
                        <span class="chat__chatblock-time">${this.props.time}</span>
                        ${this.props.unread ?
                `<div class="chat__chatblock-unread">${this.props.unread}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
}
