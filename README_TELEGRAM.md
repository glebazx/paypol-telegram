# PayPol - Telegram Мини Приложение

Это версия банка PayPol, интегрированная с Telegram как мини-приложение (Web App).

## 🚀 Быстрый старт

### 1. Создание бота в Telegram

1. Откройте Telegram и напишите боту **@BotFather**
2. Выберите `/newbot` и следуйте инструкциям
3. Вы получите **API Token** (выглядит как: `123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh`)

### 2. Установка зависимостей

```bash
cd c:\Users\glebi\Documents\Projects\paypol-telegram
npm install
```

### 3. Запуск сервера

**Вариант 1: Только сервер (для тестирования)**
```bash
npm start
```
Откройте: http://localhost:3000/telegram-main.html

**Вариант 2: С ботом (нужен хостинг)**
```bash
TELEGRAM_BOT_TOKEN=ваш_токен npm run bot
```

### 4. Настройка Web App в боте

После получения токена, установите Web App URL:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebAppInfo" \
  -d "button_text=PayPol Bank" \
  -d "url=https://yourserver.com/telegram-main.html"
```

Или используйте **@BotFather** → меню настроек → Web App

## 📱 Как пользователь откроет приложение

1. Найти вашего бота в Telegram (поиск по имени)
2. Отправить `/start`
3. Нажать кнопку "💳 Открыть PayPol"
4. Приложение откроется в Telegram как мини-app

## 🔧 Структура файлов

```
paypol-telegram/
├── bot.js                  # Основной файл Telegram бота
├── server.js               # Express сервер (неизменённый)
├── telegram-main.html      # Адаптированная версия для Telegram
├── profile.html            # Профиль пользователя
├── style.css               # Стили
├── login.html              # Логин
├── register.html           # Регистрация
└── package.json            # Зависимости
```

## 🌐 Интеграция с хостингом

### Для Render.com

1. Создайте Web Service на Render
2. Установите переменную окружения:
   - `TELEGRAM_BOT_TOKEN` = ваш токен
3. Start Command: `npm run bot`
4. Используйте URL хостинга в настройках бота

### Для Railway

1. Подключите репозиторий
2. Добавьте переменные окружения
3. Start Command: `npm run bot`

## 🎯 Особенности Telegram версии

✅ Интеграция с Telegram Web App API
✅ Тактильная обратная связь (haptic feedback)
✅ Темные цвета под Telegram стиль
✅ Закрытие приложения кнопкой Выход
✅ Работает как локально, так и в Telegram
✅ Все функции банка (карты, переводы, обмен)

## 🔐 Безопасность

- Токен хранится в переменных окружения
- Данные передаются через HTTPS (в боевом режиме)
- Используются Telegram ID для аутентификации

## ⚙️ Тестирование локально

Чтобы тестировать без Telegram:

```bash
npm start
```

Откройте в браузере:
```
http://localhost:3000/telegram-main.html?user=TestUser
```

## 📚 Документация

- Telegram Bot API: https://core.telegram.org/bots/api
- Web App API: https://core.telegram.org/bots/webapps
- Node Telegram Bot: https://github.com/yagop/node-telegram-bot-api

## 💡 Советы

1. **Тестируйте в @BotFather сначала** - он помогает настроить все параметры
2. **Используйте HTTPS** - Telegram требует безопасное соединение
3. **Сохраняйте токен в переменных окружения** - не коммитьте в git!
4. **Тестируйте на разных устройствах** - Telegram может выглядеть по-разному

## 📞 Поддержка

Если возникают проблемы:
1. Проверьте токен - он правильный?
2. Тестируйте локально сначала (npm start)
3. Смотрите консоль браузера (F12) для ошибок
4. Проверьте, что URL доступен с интернета (для боевого режима)

---

**Версия:** 1.0.0  
**Создано:** 2026-08-12  
**Статус:** Готово к использованию 🎉
