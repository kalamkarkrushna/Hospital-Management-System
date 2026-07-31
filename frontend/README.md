# Frontend — Hospital Management System

React SPA for the Hospital Management System, built with Vite + Tailwind CSS v4 + shadcn/ui.

## Setup

```bash
cp .env.example .env   # optional — VITE_API_URL defaults to http://localhost:8080/api
npm install
npm run dev
```

Opens on `http://localhost:5173` and calls the backend at `http://localhost:8080/api` by default.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080/api` | Base URL of the backend API (no trailing slash). E.g. `https://backend-production-88e3a.up.railway.app/api` |

`VITE_*` vars are baked in at build time — redeploy after changing them.

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Landing page with LiquidEther background |
| `/login` | Login | Sign in |
| `/register` | Register | New hospital registration |
| `/dashboard` | Dashboard | Stats overview (10 cards) |
| `/patients` | PatientList | List + inline add/edit/delete |
| `/doctors` | DoctorList | Manage doctors |
| `/appointments` | AppointmentList | List + inline book/edit/delete |
| `/invoices` | InvoiceList | Billing management |
| `/pharmacy` | MedicineList | Pharmacy inventory |
| `/lab-reports` | LabReportList | Lab test results |
| `/shifts` | ShiftList | Staff scheduling |
| `/inventory` | InventoryList | Equipment tracking |
| `/telemedicine` | VideoCallList | Telemedicine scheduling |
| `/insights` | Insights | Charts and analytics |
| `/admin` | ManageUsers | User management (ADMIN only) |

## Demo Credentials

- **Admin:** `admin@hospital.com` / `admin123`
- **Staff:** `doctor@hospital.com` / `doctor123`
