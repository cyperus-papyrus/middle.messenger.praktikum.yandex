import Block, { IBlockEvents } from '../../framework/Block';

export interface IFooterLink {
    text: string;
    target: string;
}

interface IFooterProps {
    links: IFooterLink[];
    events?: IBlockEvents;
}

export default class Footer extends Block {
    constructor(props: IFooterProps) {
        super({
            ...props,
            attr: {
                class: 'footer'
            }
        });
    }

    render(): string {
        return `<footer>
            <nav class="footer-nav">
                {{#each links}}
                    <button class="link footer-link" data-target="{{target}}">
                        {{text}}
                    </button>
                {{/each}}
            </nav>
            </footer>
        `;
    }
}
