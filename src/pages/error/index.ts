import Block from '../../framework/Block';
import Button from '../../components/button/button';

interface IErrorPageProps {
    img: string;
    img_alt: string;
    title: string;
}

export default class ErrorPage extends Block {
    constructor(props: IErrorPageProps) {
        const btnBack = new Button({
            id: 'btnBack',
            className: 'button-primary',
            text: 'Назад к чатам',
            events: {
                click: () => {
                    console.log('Back!');
                    window.history.back();
                }
            }
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
        return `
        <div>
            <img class="error__img" src="/{{img}}" alt="{{img_alt}}">
            <h1 class="error__title">{{title}}</h1>
            {{{btnBack}}}
        </div>`;
    }
}
