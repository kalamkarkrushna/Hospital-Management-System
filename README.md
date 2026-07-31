# Hospital Management System (HMS)

A full-stack multi-tenant Hospital Management SaaS built with **Spring Boot 3.4 + React + MySQL**.

## Live Demo

- **Frontend:** https://hrm-k.up.railway.app
- **Backend API:** https://backend-production-0cff.up.railway.app
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

**Backend:** Java 17+, Spring Boot 3.4.5, Spring Data JDBC, MySQL 8.0, Maven
**Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/ui, Recharts, Lucide React
**Auth:** JWT (HttpOnly cookies + Bearer header), BCrypt, rate limiting

## Quick Start

### Prerequisites
- JDK 17+, Maven, Node.js 18+, MySQL 8.0

### 1. Database
```sql
CREATE DATABASE Hospital;
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Starts on `http://localhost:8080`. Uses `DB_PASSWORD` env var (default: `Krushna@2155`).

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Starts on `http://localhost:5173`.

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

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PASSWORD` | `Krushna@2155` | MySQL password |
| `JWT_SECRET` | (hardcoded fallback) | JWT signing secret |

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
└── README.md
```
