import Block, { IBlockEvents } from '../../framework/Block';
import Icon from '../icon/icon';

interface IButtonProps {
    id?: string;
    className?: string;
    disabled?: boolean;
    type?: string;
    text?: string;
    icon?: string;
    attr?: Record<string, string>;
    events?: IBlockEvents;
}

export default class Button extends Block {
    constructor(props: IButtonProps) {
        const children: Record<string, Block> = {};
        if (props.icon) {
            children.Icon = new Icon({ name: props.icon });
        }

        const attr: Record<string, string> = {
            ...props.attr,
            class: `button ${props.className || ''}`.trim(),
        };

        if (props.id) attr.id = props.id;
        if (props.disabled) attr.disabled = 'disabled';
        if (props.type) attr.type = props.type;
        super({
            text: props.text,
            attr,
            events: props.events,
            ...children
        });
    }

    render(): string {
        return `<button>
            {{text}} {{{ Icon }}} </button>
        `;
    }
}
