import Block from '../../framework/Block';
import { IBlockEvents } from '../../utils/types';

interface ISinglePageProps {
    className?: string;
    title?: string;
    form?: boolean;
    backButton?: Block;
    bodyContent?: Block[];
    footerContent?: Block[];
    events?: IBlockEvents;
}

export default class SinglePage extends Block {
    constructor(props: ISinglePageProps) {
        const children: Record<string, Block> = {};
        if (props.backButton) children.backButton = props.backButton;
        super({ ...props, ...children, hasFooter: !!props.footerContent });
    }

    render(): string {
        return `
            <div class="single-page ${this.props.className || ''}">
                <div class="single-page__header">
                    {{{backButton}}}
                    ${this.props.title ?
                `<h2 class="single-page__title">${this.props.title}</h2>` : ''}
                </div>
                ${this.props.form ?
                `<form class="single-page__body">{{{bodyContent}}}</form>` :
                `<div class="single-page__body">{{{bodyContent}}}</div>`}
                ${this.props.hasFooter ?
                `<div class="single-page__footer">{{{footerContent}}}</div>` : ''}
            </div>
        `;
    }
}
