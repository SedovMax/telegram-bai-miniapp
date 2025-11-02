# Telegram BAI Mini App

Мини-приложение Telegram для прохождения Шкалы тревоги Бека (BAI) и отслеживания динамики.

## Быстрый старт
1. Импортируй репозиторий в Vercel.
2. Заполни переменные окружения из `.env.example`.
3. В Supabase выполни SQL из `supabase/schema.sql`.
4. Открой через кнопку WebApp у своего бота.

## Этап 2: Авторизация через Telegram WebApp
- Клиент читает `Telegram.WebApp.initData` и отправляет на сервер.
- Сервер проверяет подпись по `TELEGRAM_BOT_TOKEN` (HMAC-SHA256, секрет = SHA256(token)).
- `POST /api/save` и `POST /api/history` требуют `initData`.
- Данные привязаны к `user_id`, история отдаётся только владельцу.
