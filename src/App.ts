import Block from './framework/Block';
import Footer from './components/nav_footer/navigationFooter';
import ErrorPage from './pages/error/index';
import Home from './pages/home/index';
import Auth from './pages/auth';
import Registration from './pages/registration';
import Profile from './pages/profile';
import ProfileChange from './pages/profileChange';
import ProfilePassChange from './pages/profilePassChange';

interface AppState {
    currentPage: string;
}

const FOOTER_LINKS = [
    { text: 'Главная', target: 'Home' },
    { text: 'Авторизация', target: 'Auth' },
    { text: 'Регистрация', target: 'Registration' },
    { text: 'Профиль', target: 'Profile' },
    { text: 'Профиль: смена данных', target: 'ProfileChange' },
    { text: 'Профиль: смена пароля', target: 'ProfilePassChange' },
    { text: '404', target: 'Page404' },
    { text: '500', target: 'Page500' }
];

export default class App {
    state: AppState;
    appElement: HTMLElement;
    private currentPageInstance: Block | null = null;
    private footer: Footer;

    constructor() {
        this.state = {
            currentPage: 'Home'
        };
        this.navigateTo = this.navigateTo.bind(this);
        this.handleFooterClick = this.handleFooterClick.bind(this);
        const appElement = document.getElementById('app');
        if (!appElement) {
            throw new Error('App element not found');
        }
        this.appElement = appElement;

        this.footer = new Footer({
            links: FOOTER_LINKS,
            events: {
                click: (e) => this.handleFooterClick(e)
            }
        });
        const footerElement = this.footer.getContent();

        this.appElement.appendChild(footerElement);

        this.render();
    }
    private handleFooterClick = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target && target.dataset.target) {
            e.preventDefault();
            this.navigateTo(target.dataset.target);
        }
    }

    public navigateTo(page: string) {
        this.state.currentPage = page;
        this.updateActiveLink(page);
        this.render();
    }

    private updateActiveLink(page: string) {
        const links = this.appElement.querySelectorAll('.footer-link');
        links.forEach(link => {
            if (link instanceof HTMLElement && link.dataset.target === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    public render() {
        if (this.currentPageInstance) {
            const oldContent = this.currentPageInstance.getContent();
            if (oldContent && oldContent.parentNode === this.appElement) {
                oldContent.remove();
            }
            this.currentPageInstance = null;
        }

        switch (this.state.currentPage) {
            case 'Home':
                this.currentPageInstance = new Home();
                break;
            case 'Auth':
                this.currentPageInstance = new Auth();
                break;
            case 'Registration':
                this.currentPageInstance = new Registration();
                break;
            case 'Profile':
                this.currentPageInstance = new Profile();
                break;
            case 'ProfileChange':
                this.currentPageInstance = new ProfileChange();
                break;
            case 'ProfilePassChange':
                this.currentPageInstance = new ProfilePassChange();
                break;
            case 'Page404':
                this.currentPageInstance = new ErrorPage({
                    img: "404.svg",
                    img_alt: "404",
                    title: "Не туда попали"
                });
                break;
            case 'Page500':
                this.currentPageInstance = new ErrorPage({
                    img: "500.svg",
                    img_alt: "500",
                    title: "Уже фиксим"
                });
                break;
            default:
                this.currentPageInstance = new ErrorPage({
                    img: "404.svg",
                    img_alt: "404",
                    title: "Не туда попали"
                });
        }

        const pageContent = this.currentPageInstance.getContent();
        const footer = this.appElement.querySelector('footer');
        if (pageContent && footer) {
            this.appElement.insertBefore(pageContent, footer);
            this.currentPageInstance.show();
        } else if (pageContent) {
            this.appElement.appendChild(pageContent);
            this.currentPageInstance.show();
        }

        this.updateActiveLink(this.state.currentPage);
    }
}
