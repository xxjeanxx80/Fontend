🧠 Overview

This is the frontend client for Beauty Booking Hub, built using Next.js 14 App Router and TailAdmin UI Kit.

The goal is to provide:

Customer booking and management UI

Spa Owner management panel

Admin TailAdmin dashboard

and connect directly to the backend API (http://localhost:3000) built with NestJS.

🧩 Tech Stack

Framework: Next.js 14+ (App Router only)

Language: TypeScript

UI Framework: TailAdmin + TailwindCSS

HTTP Client: Axios

Auth: JWT (Bearer token stored in localStorage or cookies)

Routing: App Router groups for each role

State Management: React hooks + Context

API Documentation: Swagger /api/docs-json

📂 Project Structure
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # Public home
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── customer/page.tsx
│   │   ├── customer/bookings/page.tsx
│   │   └── customer/spas/page.tsx
│   ├── (owner)/
│   │   ├── layout.tsx
│   │   ├── owner/page.tsx
│   │   ├── owner/bookings/page.tsx
│   │   └── owner/staff/page.tsx
│   └── (admin)/
│       ├── layout.tsx
│       ├── admin/page.tsx
│       ├── admin/users/page.tsx
│       ├── admin/bookings/page.tsx
│       └── admin/settings/page.tsx
│
├── components/
│   ├── ui/
│   ├── common/
│   └── layouts/
│
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── useRoleRedirect.ts
│
├── lib/
│   ├── auth.ts
│   ├── axiosClient.ts
│   └── constants.ts
│
├── middleware.ts
└── next.config.js

⚙️ .env.local configuration

Must be created at project root.

# FRONTEND runs on port 3001
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Beauty Booking Hub
NEXT_PUBLIC_TAILADMIN_ENABLED=true

🧱 Axios Client (src/lib/axiosClient.ts)
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

🔑 Auth Flow

When user signs up or logs in → call:

POST /auth/register

POST /auth/login

If success:

Save access_token and role in localStorage.

Redirect user by role:

Admin → /admin

Owner → /owner

Customer → /customer

If token missing or invalid → redirect to /signin.

🧭 Middleware (src/middleware.ts)

Handles route protection and redirects:

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const path = req.nextUrl.pathname;

  if (!token && path.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (token && (path.startsWith('/signin') || path.startsWith('/signup'))) {
    switch (role) {
      case 'ADMIN': return NextResponse.redirect(new URL('/admin', req.url));
      case 'OWNER': return NextResponse.redirect(new URL('/owner', req.url));
      case 'CUSTOMER': return NextResponse.redirect(new URL('/customer', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
};

🚀 Build & Run Commands
# Install dependencies
npm install

# Run dev server (http://localhost:3001)
npm run dev

# Build production version
npm run build

# Start production server
npm start

🧪 Test Connectivity

To ensure frontend connects to backend successfully:

# Test backend availability
curl http://localhost:3000/api/health

# Test signup endpoint
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"123456","role":"CUSTOMER"}'


If these return { success: true }, frontend will connect correctly.

💥 Common Issues
Error	Cause	Fix
Failed to fetch	Backend not running / wrong URL	Update .env.local → NEXT_PUBLIC_API_URL=http://localhost:3000/api
CORS policy	Backend not allowing origin http://localhost:3001	Enable CORS in backend: origin: ['http://localhost:3001']
401 Unauthorized	Missing token	Check login flow → token saved to localStorage
404	Wrong endpoint path	Verify Swagger docs /api/docs-json
✅ Expected Behavior

npm run dev → launches localhost:3001

Register/Login calls backend http://localhost:3000/api/auth/...

JWT token stored in localStorage

User redirected by role

Admin UI uses TailAdmin components

Customer/Owner UIs use simpler layouts

🤖 Codex Task Scope

Codex should:

Auto-create .env.local (if missing).

Ensure src/lib/axiosClient.ts uses process.env.NEXT_PUBLIC_API_URL.

Test connection with backend /api/health and /api/auth/login.

Log clear console error if fetch fails (with message “Backend not reachable”).

On success → continue integrating modules via REST APIs.

🧠 Summary

This configuration ensures Codex:

Detects the App Router architecture (no /pages/)

Understands correct API base (http://localhost:3000/api)

Initializes .env.local automatically

Links frontend:3001 ↔ backend:3000 successfully