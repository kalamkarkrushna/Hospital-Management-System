# Deployment Guide

How to deploy the Hospital Management System (HMS) to **Railway** (backend + database) and **Vercel** (frontend).

## Architecture

```
┌──────────────────┐        HTTPS / CORS        ┌──────────────────────┐
│  Vercel          │  ──────────────────────►  │  Railway             │
│  Frontend (Vite) │      /api/auth/login      │  backend (Spring)    │
│  React 19 SPA    │                           │      │               │
└──────────────────┘                           │      ▼               │
                                               │  MySQL (Railway)     │
                                               └──────────────────────┘
```

- **Backend:** Spring Boot 3.4 (Java 21), deployed on Railway, built with Railpack. Serves on port `8080` (uses the `PORT` var Railway injects).
- **Database:** MySQL 8, provisioned as a separate Railway service, reachable at `mysql.railway.internal:3306` over the private network.
- **Frontend:** React + Vite SPA. Primary host is **Vercel**; a Railway mirror is optional.
- **Auth:** JWT in an HttpOnly cookie / Bearer header. CORS must whitelist the frontend origin.

## Prerequisites

- A [Railway](https://railway.com) account (project name in this guide: `hms`)
- A [Vercel](https://vercel.com) account
- A GitHub repo for CI/CD (optional but recommended)
- Local tooling: [Railway CLI](https://docs.railway.com/cli/installation), Node.js 20+, Maven + JDK 21 (only for local runs)

---

## 1. Railway — Database

1. In your Railway project, create a service from the **MySQL** template.
2. Leave the default credentials as-is; Railway generates a password for you.
3. No public domain is needed — the backend connects over the private network via `mysql.railway.internal`.

Note the service reference URL shown in the dashboard (e.g. `mysql.railway.internal:3306`) — you'll use it below.

---

## 2. Railway — Backend

1. **Add a service** from your GitHub repo (or deploy locally with the CLI).
   - Root directory: `backend`
   - Builder: Railpack (auto-detected from Maven) — do not set a custom build or start command.
2. **Set environment variables** on the `backend` service (production environment):

   | Variable | Value |
   |----------|-------|
   | `MYSQLHOST` | `mysql.railway.internal` |
   | `MYSQLPORT` | `3306` |
   | `MYSQLDATABASE` | `railway` |
   | `MYSQLUSER` | `root` |
   | `MYSQLPASSWORD` | the password Railway generated for your MySQL service |
   | `JWT_SECRET` | a long random string (e.g. `openssl rand -base64 48`) |
   | `CORS_ALLOWED_ORIGINS` | comma-separated list of frontend origins (see [CORS](#cors)) |

   > Railway auto-injects `PORT`, `RAILWAY_*` and `MYSQL*` variables from the linked MySQL service if you use **service references**; set them explicitly only if you use plain values.

3. **Deploy:**

   ```bash
   # from the repo root, linked to the project
   railway up --detach --service backend
   ```

   Watch the build in the dashboard or with `railway logs --service backend`. A healthy boot looks like:

   ```
   Tomcat started on port 8080 (http) with context path '/'
   Started HospitalApplication in 5.772 seconds
   Data already exists, skipping seed   # first boot runs the seeder instead
   ```

4. **Add a public domain:**

   ```bash
   railway domain
   ```

   You get a URL like `backend-production-xxxx.up.railway.app`.

5. **Verify** the API responds:

   ```bash
   curl -i https://<your-backend>.up.railway.app/api/auth/login
   # expect 403 from Spring Security (protected) — NOT "Application not found"
   ```

---

## 3. Vercel — Frontend

1. **Import the repo** in Vercel with:
   - Framework preset: **Other**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node.js version: 20+ (e.g. 22/24)

2. **Set environment variables** (Production and Preview):

   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | `https://<your-backend>.up.railway.app/api` |

   `VITE_*` vars are baked in at **build time** — any change requires a redeploy.

3. **Deploy** (via dashboard or CLI):

   ```bash
   npx vercel --prod --project <your-project>
   ```

4. You get a URL like `https://<project>-<hash>.vercel.app`.

5. **Verify end-to-end:** open the URL, sign in with `admin@hospital.com` / `admin123`, and confirm the dashboard loads live counts.

---

## CORS

The backend only accepts requests from origins listed in `CORS_ALLOWED_ORIGINS`.

For a Vercel-hosted frontend, set it on the backend service:

```bash
railway variables set CORS_ALLOWED_ORIGINS="https://<your-project>.vercel.app" --service backend
railway redeploy --service backend --yes
```

For multiple origins (e.g. local dev + production):

```
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://<your-project>.vercel.app
```

Verify with a preflight request — expect `access-control-allow-origin` echoing your origin:

```bash
curl -i -X OPTIONS https://<your-backend>.up.railway.app/api/auth/login \
  -H "Origin: https://<your-project>.vercel.app" \
  -H "Access-Control-Request-Method: POST"
```

---

## 4. Optional — Railway Frontend Mirror

The Vercel deploy is the primary frontend; you can also keep a Railway copy:

```bash
railway variables set VITE_API_URL="https://<your-backend>.up.railway.app/api" --service frontend
railway up --detach --service frontend
```

Add a domain with `railway domain`.

---

## 5. CI/CD (GitHub Actions)

A workflow lives at `.github/workflows/deploy.yml` that runs on pushes to `main` and deploys backend and frontend with `railway up`:

1. Create a **project token** in Railway: *Project → Settings → Tokens* (scoped to the project).
2. Add it as the GitHub repo secret **`RAILWAY_TOKEN`**.
3. Push to `main` — the workflow deploys both services.

The GitHub integration also supports auto-deploys per service via *Settings → Source*.

---

## Environment Variables — Reference

See `backend/.env.example` and `frontend/.env.example` in the repo for the full list with defaults.

| Variable | Where | Required | Description |
|----------|-------|----------|-------------|
| `MYSQLHOST` | backend | yes | MySQL host (`mysql.railway.internal` on Railway) |
| `MYSQLPORT` | backend | yes | MySQL port (`3306`) |
| `MYSQLDATABASE` | backend | yes | Database name (`railway`) |
| `MYSQLUSER` | backend | yes | MySQL user (`root`) |
| `MYSQLPASSWORD` | backend | yes | MySQL password (falls back to `DB_PASSWORD`) |
| `DB_PASSWORD` | backend | no | Fallback MySQL password |
| `JWT_SECRET` | backend | yes (prod) | JWT signing secret |
| `CORS_ALLOWED_ORIGINS` | backend | yes (prod) | Comma-separated allowed frontend origins |
| `PORT` | backend | no | HTTP port (Railway injects automatically) |
| `VITE_API_URL` | frontend | yes | Backend API base URL, e.g. `https://<backend>.up.railway.app/api` |

---

## Troubleshooting

### Requests to the backend return `404 Application not found` (`x-railway-fallback: true`)
The Railway edge has no route registered for the domain — this can happen right after a domain is created/changed or a deployment is replaced.

```bash
railway redeploy --service backend --yes   # force the edge to re-register the route
```
Then re-test `curl -i https://<your-backend>.up.railway.app/api/doctors` — you should get a **403** (auth required), not the fallback 404.

### `403 Forbidden` on every endpoint
Expected for unauthenticated requests — the JWT filter is doing its job. Sign in through the frontend first.

### Browser shows CORS errors
- Confirm `CORS_ALLOWED_ORIGINS` on the backend **exactly** matches the frontend origin (no trailing slash).
- Confirm the backend was **redeployed** after the variable change.
- `VITE_*` changes require a **Vercel redeploy**.

### Build fails on Railway
- Root directory must be `backend` (backend service) or `frontend` (frontend service).
- Use Railpack (auto-detect) — no custom start command needed; Spring Boot picks up `PORT`.

### Frontend can't reach the backend (login fails)
- Verify `VITE_API_URL` is set in the deployed frontend build: check the site's JS bundle for your backend URL.
- Verify the backend domain is the one in `VITE_API_URL` and is reachable from your browser.
