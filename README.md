# Beauty Studio — Full-Stack Web Application

Полнофункциональный сайт салона красоты с онлайн-записью клиентов, портфолио и панелью администратора.

---

## Структура проекта

```
beauty-studios/
├── frontend/                  # Next.js 14 + Tailwind CSS
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Главная страница
│   │   │   ├── services/page.tsx     # Страница услуг
│   │   │   ├── portfolio/page.tsx    # Портфолио
│   │   │   ├── booking/page.tsx      # Онлайн-запись
│   │   │   └── admin/
│   │   │       ├── page.tsx          # Логин администратора
│   │   │       ├── layout.tsx        # Sidebar layout
│   │   │       └── dashboard/
│   │   │           ├── page.tsx              # Обзор
│   │   │           ├── appointments/page.tsx # Управление записями
│   │   │           ├── services/page.tsx     # Управление услугами
│   │   │           ├── gallery/page.tsx      # Управление портфолио
│   │   │           └── masters/page.tsx      # Мастера и расписание
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/api.ts                # Axios API клиент
│   │   └── types/index.ts            # TypeScript типы
│   ├── Dockerfile
│   └── package.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── index.js                  # Entry point
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── appointments.js
│   │   │   ├── services.js
│   │   │   ├── gallery.js
│   │   │   └── masters.js
│   │   └── middleware/
│   │       ├── auth.js               # JWT middleware
│   │       ├── rateLimiter.js        # Rate limiting
│   │       └── upload.js             # Cloudinary upload
│   ├── prisma/
│   │   ├── schema.prisma             # БД схема
│   │   └── seed.js                   # Начальные данные
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml          # Dev окружение
├── docker-compose.prod.yml     # Prod окружение
├── nginx.conf                  # Nginx reverse proxy
└── .env.example               # Переменные окружения
```

---

## Быстрый старт (Docker)

### 1. Клонируем и настраиваем окружение

```bash
cd "Beauty Studios"

# Копируем env файл
cp .env.example .env

# Открываем и заполняем переменные
nano .env
```

### 2. Заполняем .env файл

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_strong_password
POSTGRES_DB=beauty_salon

JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Получить на https://cloudinary.com (бесплатно)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Запускаем

```bash
docker-compose up --build
```

Приложение будет доступно:
- **Сайт:** http://localhost:3000
- **API:** http://localhost:5000
- **Admin:** http://localhost:3000/admin

### 4. Данные для входа в админку

```
Email:    admin@beautysalon.com
Пароль:   admin123
```

---

## Локальная разработка (без Docker)

### Требования
- Node.js 20+
- PostgreSQL 14+

### Backend

```bash
cd backend
cp .env.example .env
# Заполните .env

npm install
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Укажите NEXT_PUBLIC_API_URL=http://localhost:5000

npm install
npm run dev
```

---

## Деплой на VPS / облако

### Вариант 1: Docker на VPS

```bash
# На сервере
git clone <your-repo>
cd beauty-studios
cp .env.example .env
nano .env  # заполните продакшн-переменные

# Запуск в продакшн режиме
docker-compose -f docker-compose.prod.yml up -d --build
```

### Вариант 2: Railway

1. Создайте проект на Railway
2. Добавьте PostgreSQL service
3. Задеплойте backend из папки `/backend`
4. Задеплойте frontend из папки `/frontend`
5. Установите переменные окружения

### Вариант 3: Render

1. Создайте Web Service из папки `backend`
2. Создайте Static Site / Web Service из папки `frontend`
3. Добавьте PostgreSQL database
4. Установите env переменные

---

## API Endpoints

### Auth
| Метод | URL | Описание |
|-------|-----|----------|
| POST | /api/auth/login | Вход администратора |
| GET | /api/auth/me | Текущий пользователь |

### Appointments (Записи)
| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| POST | /api/appointments | Public | Создать запись |
| GET | /api/appointments | Admin | Все записи |
| PATCH | /api/appointments/:id/status | Admin | Изменить статус |
| DELETE | /api/appointments/:id | Admin | Удалить запись |
| GET | /api/appointments/available-slots | Public | Свободные слоты |

### Services (Услуги)
| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | /api/services | Public | Список услуг |
| POST | /api/services | Admin | Добавить услугу |
| PUT | /api/services/:id | Admin | Обновить услугу |
| DELETE | /api/services/:id | Admin | Удалить услугу |

### Gallery (Портфолио)
| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | /api/gallery | Public | Все фото |
| POST | /api/gallery | Admin | Загрузить фото |
| DELETE | /api/gallery/:id | Admin | Удалить фото |
| PATCH | /api/gallery/:id/featured | Admin | Отметить лучшим |

### Masters (Мастера)
| Метод | URL | Доступ | Описание |
|-------|-----|--------|----------|
| GET | /api/masters | Public | Список мастеров |
| POST | /api/masters | Admin | Добавить мастера |
| PUT | /api/masters/:id/schedule | Admin | Обновить расписание |
| DELETE | /api/masters/:id | Admin | Удалить мастера |

---

## База данных

Схема создаётся автоматически через Prisma Migrate.

Таблицы:
- **users** — администраторы
- **services** — услуги (name, price, duration, category)
- **masters** — мастера с расписанием
- **appointments** — записи клиентов
- **gallery** — фотографии портфолио
- **schedules** — расписание мастеров

---

## Безопасность

- Пароли хешируются через **bcrypt** (salt rounds: 12)
- JWT токены с настраиваемым сроком жизни
- **Rate limiting:** 200 req/15min global, 10 req/15min на логин, 5 req/час на запись
- **Helmet.js** — security headers
- **CORS** — только с разрешённых доменов
- Валидация всех входных данных через **express-validator**
- Только администраторы имеют доступ к admin API

---

## Технологии

| Слой | Технология |
|------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Стили | Tailwind CSS |
| Backend | Node.js, Express |
| База данных | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Файлы | Cloudinary |
| Деплой | Docker, Nginx |
| Формы | React Hook Form |
| Запросы | Axios |
