# Hospital Management System (HMS)

A full-stack multi-tenant Hospital Management SaaS built with **Spring Boot 3.4 + React + MySQL**.

## Live Demo

- **Frontend (Vercel):** https://hospital-management-system-eta-beige.vercel.app
- **Frontend (Railway):** https://hrm-k.up.railway.app
- **Backend API (Railway):** https://backend-production-88e3a.up.railway.app
- Demo login: `admin@hospital.com` / `admin123`

## Features (12 Modules)

| Module | Page | Description |
|--------|------|-------------|
| Patient Management | `/patients` | Add, search, edit, delete patients |
| Doctor Directory | `/doctors` | Manage doctors and specializations |
| Appointment Booking | `/appointments` | Book and manage appointments |
| Role-Based Access | — | ADMIN / STAFF roles with protected routes |
| Multi-Tenant | — | Each hospital gets isolated data via `hospital_id` |
| AI-Powered Insights | `/insights` | Dashboard with stats and visual insights |
| Billing & Invoicing | `/invoices` | Create and track invoices |
| Pharmacy Management | `/pharmacy` | Medicine inventory with stock tracking |
| Lab Reports | `/lab-reports` | Manage test results and reports |
| Staff Scheduling | `/shifts` | Shift management for staff |
| Telemedicine | `/telemedicine` | Video call scheduling with meeting links |
| Inventory Management | `/inventory` | Equipment and supply tracking |

## Tech Stack

**Backend:** Java 21, Spring Boot 3.4.5, Spring Data JDBC, MySQL 8.0, Maven
**Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui, Recharts, Lucide React
**Auth:** JWT (HttpOnly cookies + Bearer header), BCrypt, rate limiting
**Deploy:** Railway (backend + MySQL + frontend mirror), Vercel (frontend)

## Quick Start

### Prerequisites
- JDK 21+, Maven, Node.js 20+, MySQL 8.0

### 1. Backend
```bash
cd backend
cp .env.example .env
mvn spring-boot:run
```
Starts on `http://localhost:8080`. Copy the env vars from `backend/.env.example` into your environment or `.env` file.

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Starts on `http://localhost:5173`. Set `VITE_API_URL` in `frontend/.env` to point at the backend (`http://localhost:8080/api` by default).

## Demo Data

On first startup, the backend seeds demo data automatically:
- **Hospital:** City General Hospital
- **Admin:** `admin@hospital.com` / `admin123`
- **Staff:** `doctor@hospital.com` / `doctor123`
- 5 patients, 4 doctors, 5 appointments, 5 invoices, 6 medicines, 4 lab reports, 4 shifts, 4 inventory items, 2 video calls

To reset: truncate all tables and restart.

## API Overview

All endpoints under `/api/` require JWT auth (except `/api/auth/**`).

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Login |
| `/api/auth/register` | POST | No | Register new hospital |
| `/api/auth/logout` | POST | Yes | Logout (clears cookie) |
| `/api/patients` | GET/POST | Yes | List / Create patients |
| `/api/patients/{id}` | PUT/DELETE | Yes | Update / Delete patient |
| `/api/doctors` | GET/POST | Yes | List / Create doctors |
| `/api/appointments` | GET/POST | Yes | List / Create appointments |
| `/api/invoices/**` | GET/POST/PUT/DELETE | Yes | Full CRUD |
| `/api/medicines/**` | GET/POST/PUT/DELETE | Yes | Full CRUD |
| `/api/lab-reports/**` | GET/POST/PUT/DELETE | Yes | Full CRUD |
| `/api/shifts/**` | GET/POST/PUT/DELETE | Yes | Full CRUD |
| `/api/inventory/**` | GET/POST/PUT/DELETE | Yes | Full CRUD |
| `/api/video-calls/**` | GET/POST/PUT/DELETE | Yes | Full CRUD |
| `/api/insights` | GET | Yes | Dashboard stats |
| `/api/admin/users` | GET | ADMIN | List users |
| `/api/admin/users/{id}/role` | PUT | ADMIN | Change user role |

Rate limit: 20 req/min on `/api/auth/` and `/api/admin/`.

## Environment Variables

### Backend (`backend/.env.example`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MYSQLHOST` | `localhost` | MySQL host |
| `MYSQLPORT` | `3306` | MySQL port |
| `MYSQLDATABASE` | `Hospital` | MySQL database name |
| `MYSQLUSER` | `root` | MySQL username |
| `MYSQLPASSWORD` | `Krushna@2155` (via `DB_PASSWORD`) | MySQL password |
| `DB_PASSWORD` | — | Fallback password if `MYSQLPASSWORD` is unset |
| `PORT` | `8080` | HTTP port (Railway injects `PORT`) |
| `JWT_SECRET` | (hardcoded fallback) | JWT signing secret — set a long random value in production |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated list of allowed frontend origins |

### Frontend (`frontend/.env.example`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Base URL of the backend API (no trailing slash) |

## Deployment

Full step-by-step guide: **[DEPLOYMENT.md](DEPLOYMENT.md)**.

- **Railway (backend + MySQL):** root directory `backend`, Railpack builder, set `MYSQL*`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, then `railway up --detach --service backend` and `railway domain`.
- **Vercel (frontend):** root directory `frontend`, build `npm run build`, output `dist`, env var `VITE_API_URL=https://<backend>.up.railway.app/api`.
- **CI/CD:** `.github/workflows/deploy.yml` deploys both services on push to `main` using a `RAILWAY_TOKEN` secret.

> **Gotcha:** after creating or changing the backend domain, run `railway redeploy --service backend --yes` so the edge registers the new route — otherwise requests return `404 Application not found` (`x-railway-fallback: true`).

## Project Structure

```
├── backend/              # Spring Boot API
│   └── src/main/java/com/hospital/
│       ├── config/       # Security, CORS, JWT, rate limiter
│       ├── controller/   # REST controllers
│       ├── model/        # JDBC entities
│       ├── repository/   # Data repositories
│       └── service/      # Business logic
├── frontend/             # React SPA
│   └── src/
│       ├── components/   # Page components & UI
│       ├── context/      # Auth context
│       └── api.js        # API client
├── DEPLOYMENT.md         # Deployment guide (Railway + Vercel)
└── README.md
```
