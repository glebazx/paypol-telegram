# 🤖 ТЕЛЕГРАМ БОТ - БЫСТРЫЙ СТАРТ

## Шаг 1: Получить токен
1. Откройте Telegram
2. Напишите **@BotFather**
3. Нажмите `/newbot`
4. Следуйте инструкциям
5. Скопируйте токен вида: `123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh`

## Шаг 2: Запустить сервер ЛОКАЛЬНО (для тестирования)

Откройте PowerShell в папке `paypol-telegram`:

```powershell
cd c:\Users\glebi\Documents\Projects\paypol-telegram
npm start
```

Откройте в браузере:
```
http://localhost:3000/telegram-main.html?user=TestUser
```

✅ Вы должны видеть банк PayPol с вкладками Карты, Переводы, Обмен, История!

## Шаг 3: Запустить БОТ локально

Откройте в ДРУГОМ PowerShell окне:

```powershell
$env:TELEGRAM_BOT_TOKEN = "ВАШ_ТОКЕН_СЮДА"
cd c:\Users\glebi\Documents\Projects\paypol-telegram
npm run bot
```

## Шаг 4: Протестировать бота

1. Откройте Telegram
2. Найдите своего бота по имени
3. Отправьте `/start`
4. Нажмите кнопку "💳 Открыть PayPol"
5. Должно открыться мини-приложение 🎉

## 🌐 Запуск на ХОСТИНГЕ (Render, Railway и т.д.)

1. Загрузите проект на GitHub
2. Создайте Web Service на хостинге
3. Добавьте переменную окружения:
   ```
   TELEGRAM_BOT_TOKEN = ваш_токен
   ```
4. Start Command: `npm run bot`
5. Используйте URL хостинга в настройках бота

## 📁 Что находится в папке paypol-telegram?

- `server.js` - серверная часть (API)
- `bot.js` - Telegram бот
- `telegram-main.html` - интерфейс для Telegram
- `profile.html`, `login.html`, `register.html` - другие страницы
- `style.css` - стили
- `info.json` - база данных пользователей

## ✨ Особенности

✅ Регистрация и вход  
✅ Выпуск карт с разными дизайнами  
✅ Пополнение баланса  
✅ Переводы между пользователями  
✅ Обмен валют (RUB, USD, EUR)  
✅ История всех операций  
✅ Интеграция с Telegram Web App API  

## ⚠️ Важные замечания

1. **Локально** - используйте `npm start`
2. **С ботом** - используйте `npm run bot` + установите токен в `TELEGRAM_BOT_TOKEN`
3. **На хостинге** - URL должен быть https://
4. Токен никогда не коммитьте в git! Используйте .env

## 🆘 Если не работает

1. Проверьте токен - правильный ли?
2. Откройте консоль браузера (F12) - есть ошибки?
3. Проверьте PowerShell - нет ошибок при запуске?
4. Попробуйте в другом браузере

---

**Готово!** Ваш банк теперь работает в Telegram! 💳✨
