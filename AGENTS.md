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
Each module (users, customers, bookings, spas, etc.) has:
-src/api/<module>.api.ts
-src/pages/<module>/index.tsx (list)
-src/pages/<module>/create.tsx (form)

API Integration Rules
-Use REST endpoints defined by backend (NestJS):
-/auth/login, /auth/register, /auth/refresh
-/users, /customers, /bookings, /spas, /services
-Authenticated routes require Bearer token.
-Store token in localStorage after successful login.
-Implement route guard: redirect to /login if no token.

Data Display
-Use TailAdmin table & form components.
-Format API responses with data.success, data.message, data.data.

Error Handling
-Display errors with toast notifications.
-Handle 401 (Unauthorized): clear token & redirect to login.
-Handle validation errors: show form field messages.

Developer Commands
-npm install
-npm run dev → runs on http://localhost:3001
.env.local:
-NEXT_PUBLIC_API_URL=http://localhost:3000

Build Goals
Integrate with Beauty Booking Hub backend.
Implement modules: Auth, Users, Customers, Bookings, Dashboard.
Use backend Swagger JSON for type-safe API generation.

