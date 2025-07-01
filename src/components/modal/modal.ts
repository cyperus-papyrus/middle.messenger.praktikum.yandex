import Block, { IBlockEvents } from '../../framework/Block';

interface IModalProps {
    className?: string;
    title?: string;
    form?: boolean;
    backButton?: Block;
    bodyContent?: Block[];
    footerContent?: Block[];
    events?: IBlockEvents;
}

export default class Modal extends Block {
    constructor(props: IModalProps) {
        const children: Record<string, Block> = {};
        if (props.backButton) children.backButton = props.backButton;

        super({ ...props, ...children });
    }

    render(): string {
        return `
            <div class="modal ${this.props.className || ''}">
                <div class="modal__header">
                    {{{backButton}}}
                    ${this.props.title ? `<h2 class="modal__title">${this.props.title}</h2>` : ''}
                </div>
                ${this.props.form ?
                `<form class="modal__body">{{{bodyContent}}}</form>` :
                `<div class="modal__body">{{{bodyContent}}}</div>`}
                <div class="modal__footer">{{{footerContent}}}</div>
            </div>
        `;
    }
}
