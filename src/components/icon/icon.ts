import Block from '../../framework/Block';

interface IIconProps {
    name?: string;
    iconClass?: string;
}

export default class Icon extends Block {
    constructor(props: IIconProps) {
        super({
            ...props,
            attr: {
                class: `icon${props.iconClass ? ` ${props.iconClass}` : ''}`
            }
        });
    }

    render(): string {
        return `
            <img
                src="/{{name}}.svg"
                alt="{{name}}"
                class="icon-image"
            />
        `;
    }
}
