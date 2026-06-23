# Flower Shop — Full Stack Web Application

A full-featured flower shop e-commerce platform built with **React + TypeScript** (frontend), **FastAPI + Python** (backend), **PostgreSQL** (database), and **Docker Compose** orchestration.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Ваш основний Nginx                   │
│  (HTTPS, WebSocket, gzip, security headers)         │
│  flower-shop.local ↔ 443                            │
└──────┬──────────────────────────────┬──────────────┘
       │                              │
       ▼                              ▼
┌──────────────┐             ┌────────────────┐
│   Frontend   │             │    Backend     │
│  React SPA   │             │   FastAPI      │
│  :80 (int)   │             │  :8000 (int)   │
└──────────────┘             └───────┬────────┘
       │                             │
       │         ┌───────────┐      │
       └────────▶│  Docker   │◄─────┘
                 │  Network  │
                 └─────┬─────┘
                       │
                       ▼
                ┌──────────────┐
                │  PostgreSQL  │
                │  :5432 (int) │
                └──────────────┘
```

### Сервіси

| Сервіс     | Технології                                | Внутрішній порт |
|------------|-------------------------------------------|----------------|
| Frontend   | React 19, Vite, TypeScript, shadcn/ui     | 80             |
| Backend    | Python 3.12, FastAPI, SQLAlchemy (async)   | 8000           |
| PostgreSQL | PostgreSQL 16 Alpine                       | 5432           |

### Комунікація

- Усі сервіси спілкуються через **внутрішню Docker мережу** (`flower_network`)
- Жоден сервіс не використовує `localhost` для звернень до інших сервісів
- Backend звертається до PostgreSQL за ім'ям контейнера: `postgres:5432`
- Ваш основний Nginx проксує запити до контейнерів через опубліковані порти або через Docker network

---

## 🚀 Швидкий старт

### Передумови

- Docker & Docker Compose v2
- Git

### Налаштування та запуск

```bash
# 1. Клонувати репозиторій
git clone <repo-url> flower-shop
cd flower-shop

# 2. Налаштувати змінні оточення
cp .env.example .env
# Відредагуйте .env — обов'язково змініть:
#   - POSTGRES_PASSWORD
#   - SECRET_KEY (згенеруйте: openssl rand -hex 32)
#   - CORS_ORIGINS (додайте ваш домен)

# 3. Запустити всі сервіси
docker compose up -d

# 4. Перевірити статус
docker compose ps
docker compose logs -f

# 5. Зупинити
docker compose down

# 6. Зупинити і видалити volumes (OBEPEЖНО — видалить базу даних)
# docker compose down -v
```

### Доступ до сервісів

| Сервіс              | URL (через ваш Nginx)        | Прямий доступ (dev)        |
|---------------------|------------------------------|----------------------------|
| Frontend            | https://flower-shop.local    | http://localhost:3000      |
| API                 | https://flower-shop.local/api | http://localhost:8000/api  |
| Swagger Docs        | https://flower-shop.local/docs | http://localhost:8000/docs |
| Healthcheck         |                              | http://localhost:8000/api/health |
| PostgreSQL          | —                            | localhost:5432             |

---

## 🔧 Інтеграція з вашим Nginx

Оскільки Nginx у вас встановлений окремо для кількох проектів, ось як інтегрувати цей проект:

1. **Скопіюйте конфігурацію** з `nginx/nginx.conf` у ваш основний Nginx
2. **Налаштуйте SSL** (Let's Encrypt / certbot) для домену
3. **Вкажіть правильні upstream сервери** — закоментовані варіанти є в конфігу:

```nginx
# Варіант A: Nginx у Docker (одна мережа)
upstream flower_frontend { server frontend:80; }
upstream flower_backend  { server backend:8000; }

# Варіант B: Nginx на хості, контейнери з опублікованими портами
upstream flower_frontend { server 127.0.0.1:3000; }
upstream flower_backend  { server 127.0.0.1:8000; }
```

### SSL (Let's Encrypt)

```bash
# Встановіть certbot та отримайте сертифікат
sudo certbot --nginx -d flower-shop.local -d www.flower-shop.local
```

---

## 🐳 Docker структура

```
├── Dockerfile.frontend        # Багатостадійний білд: bun → nginx:alpine
├── Dockerfile.backend         # Python 3.12 slim + uvicorn
├── docker-compose.yml         # Оркестрація (3 сервіси)
├── .env.example               # Шаблон змінних оточення
├── nginx/
│   ├── nginx.conf             # Конфіг для вашого основного Nginx
│   └── frontend.nginx.conf    # Внутрішній Nginx фронтенд-контейнера
├── postgres/
│   └── init/
│       └── 01-init.sql        # Init скрипт для першого запуску PostgreSQL
└── backend/
    ├── Dockerfile             # (використовується кореневий Dockerfile.backend)
    ├── requirements.txt
    └── app/                   # FastAPI додаток
```

### Healthchecks

Кожен контейнер має healthcheck:

| Сервіс     | Команда healthcheck                       | Інтервал |
|------------|-------------------------------------------|----------|
| postgres   | `pg_isready -U flower_shop -d flower_shop` | 10s      |
| backend    | `curl --fail http://localhost:8000/api/health` | 30s |
| frontend   | `curl --fail http://localhost:80/`         | 30s      |

### Volumes (named)

| Volume               | Контейнерний шлях          | Призначення           |
|----------------------|---------------------------|-----------------------|
| `flower_postgres_data` | `/var/lib/postgresql/data` | Дані PostgreSQL      |
| `flower_uploads_data`  | `/app/uploads`            | Завантажені файли     |

---

## 🛠️ Технологічний стек

### Frontend
- **React 19** + TypeScript Strict
- **Vite** + Tailwind CSS v4
- **shadcn/ui** компоненти
- **Framer Motion** анімації
- **React Router** v7

### Backend
- **Python 3.12** + FastAPI
- **SQLAlchemy 2.0** (async) + Repository Pattern
- **PostgreSQL 16** + asyncpg
- **JWT** auth з refresh tokens

### Інфраструктура
- **Docker Compose** з healthchecks
- **Nginx** reverse proxy + SSL
- **Named volumes** для персистентності
- **Внутрішня Docker мережа**

---

## 🧪 Локальна розробка (без Docker)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
bun install
bun run dev
```

---

## 📝 Ліцензія

MIT
