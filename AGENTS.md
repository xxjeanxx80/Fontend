# AGENTS.md (Frontend – Beauty Booking Hub Dashboard)

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **UI Kit:** TailAdmin (React + TailwindCSS)
- **Language:** TypeScript
- **State Management:** React hooks, Context API
- **HTTP Client:** Axios
- **Auth:** JWT stored in localStorage (Bearer token)
- **API Backend:** Beauty Booking Hub API (`http://localhost:3000`)
- **Swagger Endpoint:** `/api/docs-json`

## Backend API Definition
- Base URL: http://localhost:3000
- Swagger JSON file: /public/swagger.json
- Every endpoint follows NestJS convention with { success, message, data }.
- All endpoints require Bearer JWT tokens.

## Goal
Build a responsive admin dashboard for Beauty Booking Hub that connects directly to the backend APIs.

## Coding Conventions
- All API logic lives in `src/api/` folder.
- Axios instance defined in `src/api/client.ts` with:
  ```ts
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
## Each module (users, customers, bookings, spas, etc.) has:
- src/api/<module>.api.ts
- src/pages/<module>/index.tsx (list)
- src/pages/<module>/create.tsx (form)

## API Integration Rules
- Use REST endpoints defined by backend (NestJS):
- /auth/login, /auth/register, /auth/refresh
- /users, /customers, /bookings, /spas, /services
- Authenticated routes require Bearer token.
- Store token in localStorage after successful login.
- Implement route guard: redirect to /login if no token.

## Data Display
- Use TailAdmin table & form components.
- Format API responses with data.success, data.message, data.data.

## Error Handling
- Display errors with toast notifications.
- Handle 401 (Unauthorized): clear token & redirect to login.
- Handle validation errors: show form field messages.

## Developer Commands
- npm install
- npm run dev → runs on http://localhost:3001
.env.local:
- NEXT_PUBLIC_API_URL=http://localhost:3000

## Build Goals
- Integrate with Beauty Booking Hub backend.
- Implement modules: Auth, Users, Customers, Bookings, Dashboard.
- Use backend Swagger JSON for type-safe API generation.

## 🎯 Product Scope & UX Map

### 👩‍💼 For Customers:
- Sign up / Login using Google or Facebook (OAuth2)
- Search for nearby spas (geolocation + filters)
- Browse available services (at-spa / at-home)
- Book service: select time, staff, apply coupon
- Manage bookings (reschedule, cancel, rate)
- Track loyalty points and rank

### 🏪 For Spa Owners:
- Register new spa and request approval
- Manage spa details, services, pricing
- Manage staff, shifts, and time-off
- Handle bookings (approve, reject)
- View revenue, payout requests, commissions

### 🛠️ For Admins:
- Dashboard metrics (bookings, revenue, growth)
- Approve/reject spas and campaigns
- Manage coupons, reports, system settings
- Handle logs, access control, and payouts

---

## 🧱 Feature → Backend Service Mapping
| Frontend Feature | Backend Service | Key Endpoints |
|------------------|----------------|----------------|
| Auth | Auth Service | /auth/login, /auth/register, /auth/google |
| Users | User Service | /users, /users/:id/loyalty/points |
| Spas | Spa Service | /spas, /spas/:id/approval |
| Services | Service Service | /services |
| Staff | Staff Service | /staff, /staff/:id/time-off |
| Bookings | Booking Service | /bookings, /bookings/:id/reschedule |
| Feedbacks | Feedback Service | /feedbacks, /feedbacks/booking/:id |
| Payments | Payment Service | /payments, /payments/refund |
| Payouts | Payout Service | /payouts, /payouts/review |
| Campaigns | Campaign Service | /campaigns |
| Coupons | Coupon Service | /coupons |
| Reports | Report Service | /reports |
| Dashboard | Dashboard Service | /dashboard/snapshots/latest |

---

## 🧭 UX Notes
- Booking page must support **at-home vs at-spa** toggle.
- Customer search UI uses **geolocation + radius**.
- Staff selection is **availability-aware** (based on shift/time).
- Loyalty (points + rank) displayed in **user profile**.
- Admin dashboard displays **charts (bookings, revenue, payouts)**.
- Responsive layout: desktop, tablet, mobile.
- Use **React Query** for async fetching.
- Optional: i18n (English/Vietnamese).