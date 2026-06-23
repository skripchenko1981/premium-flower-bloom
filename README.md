# Flower Shop — Full Stack Web Application

A full-featured flower shop e-commerce platform built with **React + TypeScript** (frontend), **FastAPI + Python** (backend), **PostgreSQL** (database), and **Docker Compose** orchestration.

## 🏗️ Architecture

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Nginx   │───▶│ Frontend │    │ Backend  │
│  (443/80)│    │  React   │    │ FastAPI  │
└────┬─────┘    └──────────┘    └────┬─────┘
     │                                │
     └────────────────────────────────┘
                      │
               ┌──────▼──────┐
               │  PostgreSQL  │
               └─────────────┘
```

### Services
- **Frontend** — React + Vite + TypeScript, shadcn/ui, Tailwind CSS, Framer Motion
- **Backend** — FastAPI + SQLAlchemy (async), Repository Pattern, JWT auth
- **PostgreSQL** — Primary database with async access
- **Nginx** — Reverse proxy, SSL, WebSocket, caching, security headers

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose v2
- Make (optional)

### Development

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker compose up -d

# Watch logs
docker compose logs -f
```

### Services URL

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Frontend (HTTPS) | https://flower-shop.local |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Health | http://localhost:8000/api/health |
| PostgreSQL | localhost:5432 |

### Manual Run (without Docker)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
bun install
bun run dev
```

## 📁 Project Structure

```
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/       # UI components (shadcn/ui)
│   │   ├── pages/           # Route pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities
│   │   └── convex/          # (Convex not used in production)
│   ├── Dockerfile
│   └── package.json
├── backend/                   # FastAPI Python backend
│   ├── app/
│   │   ├── api/v1/          # API endpoints
│   │   ├── core/            # Config, database, security
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── repositories/    # Repository pattern
│   │   ├── schemas/         # Pydantic schemas
│   │   └── utils/           # Helpers
│   ├── alembic/             # Migrations
│   ├── Dockerfile
│   └── requirements.txt
├── nginx/                     # Nginx proxy configuration
├── postgres/                  # Database init scripts
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| GET | `/api/v1/products` | List products (search, filter, paginate) |
| GET | `/api/v1/products/featured` | Featured products |
| GET | `/api/v1/products/category/{slug}` | Products by category |
| GET | `/api/v1/products/{slug}` | Product detail |
| GET | `/api/v1/categories` | Active categories |
| POST | `/api/v1/orders` | Create order (auth optional) |
| POST | `/api/v1/reviews` | Create review |
| GET | `/api/v1/reviews/product/{id}` | Product reviews |
| POST | `/api/v1/contacts` | Submit contact form |

### Admin (requires admin JWT)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/dashboard/stats` | Dashboard statistics |
| GET/POST/PUT/DELETE | `/api/v1/categories/*` | Category management |
| GET/POST/PUT/DELETE | `/api/v1/products/*` | Product management |
| POST | `/api/v1/products/{id}/images` | Upload product image |
| GET/PUT | `/api/v1/orders/*` | Order management |
| PUT | `/api/v1/reviews/{id}/moderate` | Moderate review |
| GET | `/api/v1/contacts` | List contact submissions |
| POST | `/api/v1/upload` | Upload file |

## 🛠️ Tech Stack

### Frontend
- **React 19** + TypeScript Strict
- **Vite** + Tailwind CSS v4
- **shadcn/ui** components
- **Framer Motion** animations
- **React Router** v7

### Backend
- **Python 3.12** + FastAPI
- **SQLAlchemy 2.0** (async)
- **PostgreSQL 16** + asyncpg
- **JWT** auth with refresh tokens
- **Repository Pattern** + DI

### Infrastructure
- **Docker Compose** with healthchecks
- **Nginx** reverse proxy + SSL
- **Named volumes** for persistence
- **Internal Docker network**

## 📝 License

MIT
