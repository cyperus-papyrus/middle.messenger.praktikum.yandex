import Block from '../../framework/Block';
import { IBlockEvents } from '../../utils/types';
import Icon from '../icon/icon';

interface ILinkProps {
    id?: string;
    url?: string;
    className?: string;
    disabled?: boolean;
    text?: string;
    icon?: string;
    attr?: Record<string, string>;
    events?: IBlockEvents;
}

export default class Link extends Block {
    constructor(props: ILinkProps) {
        const children: Record<string, Block> = {};
        if (props.icon) {
            children.Icon = new Icon({ name: props.icon });
        }

        const attr: Record<string, string> = {
            ...props.attr,
            class: `${props.className || ''}`.trim(),
        };

        if (props.id) attr.id = props.id;
        if (props.disabled) attr.disabled = 'disabled';

        super({
            url: props.url,
            text: props.text,
            attr,
            events: props.events,
            ...children
        });
    }
    render(): string {
        return `<a href="{{url}}" class="{{class}}">
            {{text}}
            {{{ Icon }}}
            </a>`;
    }
}
