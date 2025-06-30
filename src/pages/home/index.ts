import Block from '../../framework/Block';
import Link from '../../components/link/link';
import Field from '../../components/field/field';
import ChatBlock from '../../components/chatBlock/chatBlock';
import ChatMessage from '../../components/chatMessage/chatMessage';
import ChatSend from '../../components/chatSend/chatSend';
import Button from '../../components/button/button';


interface IHomePageProps {
    name: string;
}

export default class HomePage extends Block {
    constructor(props: IHomePageProps) {
        const profileLink = new Link({
            text: 'Профиль',
            icon: 'ArrowRight'
        });

        const searchField = new Field({
            id: 'search',
            type: 'text',
            placeholder: 'Поиск',
            name: 'search',
            className: 'input-search'
        });

        const chatBlocks = [
            new ChatBlock({
                name: 'Андрей',
                time: '10:49', lastMessage: 'Изображение', unread: 2
            }),
            new ChatBlock({
                name: 'Илья',
                time: '10:49', lastMessage: 'Друзья, у меня для вас особенный выпуск...'
            }),
            new ChatBlock({
                name: 'Андрей',
                time: 'СР', lastMessage: 'Изображение', unread: 2
            }),
            new ChatBlock({
                name: 'Андрей',
                time: '1 мая 2025', lastMessage: 'Изображение', unread: 2
            })
        ];

        const messages = [
            new ChatMessage({
                text: 'Привет! Как дела?',
                time: '10:30',
                isMine: true,
                isRead: true
            }),
            new ChatMessage({
                text: `Привет! Смотри, тут всплыл интересный кусок лунной космической истории
                 — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC
                 для полетов на Луну. Сейчас мы все знаем что астронавты летали
                 с моделью 500 EL — и к слову говоря, все тушки этих камер
                 все еще находятся на поверхности Луны, так как астронавты
                 с собой забрали только кассеты с пленкой.
                продали на аукционе за 45000 евро.`,
                time: '10:32',
                isMine: false,
                isRead: true
            }),
            new ChatMessage({
                text: 'Круто!',
                time: '10:33',
                isMine: true,
                isRead: false
            })
        ];

        const chatSend = new ChatSend();
        const modalButton = new Button({
            className: 'button-primary',
            icon: 'Menu'
        });
        super({
            ...props,
            profileLink,
            searchField,
            chatBlocks,
            messages,
            chatSend,
            modalButton
        });

        this.lists.chatBlocks = chatBlocks;
        this.lists.messages = messages;
    }

    render(): string {
        return `
            <div class="home">
                <aside class="home__chat-menu">
                    {{{profileLink}}}
                    {{{searchField}}}
                    <div class="chat-list"> {{{ chatBlocks }}} </div>
                </aside>

                <div class="home__chat-area">
                    <div class="chat-area__header">${this.props.name} {{{ modalButton }}}</div>
                    <div class="chat-area__messages"> {{{ messages }}} </div>
                    <div class="chat-area__send">
                        {{{chatSend}}}
                    </div>
                </div>
            </div>
        `;
    }
}
