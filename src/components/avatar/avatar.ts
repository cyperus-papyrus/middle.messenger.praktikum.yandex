import Block from '../../framework/Block';

interface IAvatarProps {
    name?: string;
    alt?: string;
    className?: string;
    attr?: Record<string, string>;
}

export default class Avatar extends Block {
    constructor(props: IAvatarProps) {
        super({
            name: props.name || 'Avatar.svg',
            alt: props.alt || 'User avatar',
            attr: {
                class: `avatar ${props.className || ''}`.trim(),
                ...props.attr
            },
        })
    }

    render(): string {
        return `<img src="/{{name}}" alt="{{ alt }}" class="{{class}}" />`;
    }
}
