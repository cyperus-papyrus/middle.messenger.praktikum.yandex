# Чат-платформа 💻

Учебный проект для Практикума. Список существующих страниц:

- Главная (заглушка)
- Авторизация
- Регистрация
- Профиль
- Профиль: смена данных
- Профиль: смена пароля
- 404
- 500

⚠️ Для удобства в футере сайта расположено интерактивное меню

[![Netlify Status](https://api.netlify.com/api/v1/badges/01b80d87-ebab-43bc-a392-82316fb43183/deploy-status)](https://app.netlify.com/projects/chat-olgavrish/deploys)

## Ссылки:

[Figma](https://www.figma.com/design/nMbTLoEShwtUgU3KotLhJv/Dark-Theme-Chat-Ui?)

[Netlify: Главная (разводящая)](https://chat-olgavrish.netlify.app/)

[Netlify: Чат](https://chat-olgavrish.netlify.app/messenger)

[Netlify: Профиль](https://chat-olgavrish.netlify.app/settings)

[Netlify: Профиль: изменение данных](https://chat-olgavrish.netlify.app/settings-change)

[Netlify: Профиль: изменение пароля](https://chat-olgavrish.netlify.app/settings-change-pass)

[Netlify: Авторизация](https://chat-olgavrish.netlify.app/auth)

[Netlify: Регистрация](https://chat-olgavrish.netlify.app/sign-up)

## 🔥 Спринт_3: новые фичи

В проект добавлен роутинг, теперь страницы доступны по отдельным ссылкам. Внедрен HTTP API чатов. Регистрация, авторизация, изменение пользователя работают через API. Так же подключен WebSocket, обмен сообщениями происходит в live-режиме.

## Спринт_2: новые фичи

Проект переписан на TypeScript. Внедрен компонентный подход. Добавлено отображение списка чатов, ленты переписки, и блока нового сообщения. Всем формам добавлена валидация. В проект добавлены ESLint и Stylelint.

## 🛠 Установка и запуск

### Требования

- Установленный [Node.js](https://nodejs.org/) (версия 12.x или выше)
- Установленный [npm](https://www.npmjs.com/)

### Команды

```bash
# Установка зависимостей
npm install

# Запуск сервера для разработки (режим разработки)
npm run dev

# Сборка проекта и запуск продакшн-версии
npm run start

# Сборка проекта в папку `dist` (оптимизированная версия)
npm run build
```
