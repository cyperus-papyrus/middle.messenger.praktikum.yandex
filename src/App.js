import Handlebars from 'handlebars';
import * as Pages from './pages';

import './styles/main.scss';

import Button from './components/button/button.js';
import Link from './components/link/link.js'
import Field from './components/field/field.js'
import Modal from './components/modal/modal.js'
import footerTemplate from './components/nav_footer/navigationFooter.js';
import Icon from './components/icon/icon.js';
import Avatar from './components/avatar/avatar.js';

Handlebars.registerPartial('Field', Field);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('Link', Link);
Handlebars.registerPartial('Modal', Modal);
Handlebars.registerPartial('Footer', footerTemplate);
Handlebars.registerPartial('Icon', Icon);
Handlebars.registerPartial('Avatar', Avatar);

export default class App {
  constructor() {
    this.state = {
      currentPage: 'Home',
      footerLinks: [
        { text: 'Главная', target: 'Home' },
        { text: 'Авторизация', target: 'Auth' },
        { text: 'Регистрация', target: 'Registration' },
        { text: 'Профиль', target: 'Profile' },
        { text: 'Профиль: смена данных', target: 'ProfileChange' },
        { text: 'Профиль: смена пароля', target: 'ProfilePassChange' },
        { text: '404', target: 'Page404' },
        { text: '500', target: 'Page500' }
      ]
    };
    this.appElement = document.getElementById('app');
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  handleNavigation(e) {
    if (e.target.classList.contains('footer-link')) {
      const page = e.target.dataset.page;
      this.rerender(page);
    }
  }
  
  rerender(newState) {
    this.state.currentPage = newState;
    this.render();
  }


  render() {
    let template;
    if (this.state.currentPage === "Home") {
      template = Handlebars.compile(Pages.Home);
      this.appElement.innerHTML = template({
        footerLinks: this.state.footerLinks,
      });
    }
    if (this.state.currentPage === "Auth") {
      template = Handlebars.compile(Pages.Auth);
      this.appElement.innerHTML = template({
        footerLinks: this.state.footerLinks,
      });
    }
    if (this.state.currentPage === "Registration") {
      template = Handlebars.compile(Pages.Registration);
      this.appElement.innerHTML = template({
        footerLinks: this.state.footerLinks,
      });
    }
    if (this.state.currentPage === "Profile") {
      template = Handlebars.compile(Pages.Profile);
      this.appElement.innerHTML = template({
        footerLinks: this.state.footerLinks,
        userData: [
          { label: 'Имя', value: 'Иван' },
          { label: 'Фамилия', value: 'Иванов' },
          { label: 'Логин', value: 'ivanivanov' },
          { label: 'Почта', value: 'pochta@yandex.ru' },
          { label: 'Имя в чате', value: 'Иван' },
          { label: 'Телефон', value: '8 (800) 555-35-35' }
        ]
      });
    }
    if (this.state.currentPage === "ProfileChange") {
      template = Handlebars.compile(Pages.ProfileChange);
      this.appElement.innerHTML = template({
        footerLinks: this.state.footerLinks,
      });
    }
    if (this.state.currentPage === "ProfilePassChange") {
      template = Handlebars.compile(Pages.ProfilePassChange);
      this.appElement.innerHTML = template({
        footerLinks: this.state.footerLinks,
      });
    }
    if (this.state.currentPage === "Page404") {
      template = Handlebars.compile(Pages.ErrorTemplate);
      this.appElement.innerHTML = template({
        title: "Не туда попали",
        img: "404.svg",
        img_alt: "404",
        footerLinks: this.state.footerLinks
      });
    }
    if (this.state.currentPage === "Page500") {
      template = Handlebars.compile(Pages.ErrorTemplate);
      this.appElement.innerHTML = template({
        title: "Уже фиксим",
        img: "500.svg",
        img_alt: "500",
        footerLinks: this.state.footerLinks
      });
    }

    this.appElement.querySelector('footer').addEventListener('click', this.handleNavigation);
  }
}
