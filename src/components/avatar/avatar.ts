import Block from '../../framework/Block';
import { mainURL } from '../../utils/HTTPTransport';
import { isEmpty } from '../../utils/helpers';

interface IAvatarProps {
    src?: string | null;
    alt?: string;
    className?: string;
    attr?: Record<string, string>;
}

export default class Avatar extends Block {
    constructor(props: IAvatarProps) {
        const avatarSrc = !isEmpty(props.src)
            ? `${mainURL}/resources${props.src}`
            : '/Avatar.svg';

        super({
            src: avatarSrc,
            alt: props.alt || 'User avatar',
            attr: {
                class: `avatar ${props.className || ''}`.trim(),
                ...props.attr
            },
        })
    }

    render(): string {
        return `<div class="{{attr.class}}"><img src="{{src}}" alt="{{alt}}" /></div>`;
    }
}
