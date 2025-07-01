import Block from '../../framework/Block';
import { BackButton } from '../../components/button/button';

interface IErrorPageProps {
    img: string;
    img_alt: string;
    title: string;
}

export default class ErrorPage extends Block {
    constructor(props: IErrorPageProps) {

        const btnBack = new BackButton({
            id: 'btnBack',
            className: 'button-primary',
            text: 'Назад к чатам'
        });

        super({
            ...props,
            btnBack,
            attr: {
                class: 'error__page'
            }
        });
    }
    render(): string {
        return `<div>
            <img class="error__img" src="/{{img}}" alt="{{img_alt}}">
            <h1 class="error__title">{{title}}</h1>
            {{{btnBack}}}
        </div>`;
    }
}

export class Page404 extends ErrorPage {
    constructor() {
        super({
            img: "404.svg",
            img_alt: "404 Not Found",
            title: "Не туда попали"
        });
    }
}

export class Page500 extends ErrorPage {
    constructor() {
        super({
            img: "500.svg",
            img_alt: "500 Server Error",
            title: "Уже фиксим",
        });
    }
}
