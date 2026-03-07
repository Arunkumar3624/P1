# Employee Management System (EMS)

Production-oriented EMS with REST API (Node.js/Express/MySQL) and SPA frontend (React + Vite + Tailwind).

## Structure

```text
/root
  /server
    /src
      /controllers
      /models
      /routes
      /middleware
      /config
      /utils
      /validators
  /client
    /src
      /components (UI, Layout)
      /pages
      /hooks
      /services
      /context
```

## Backend Highlights

- JWT auth with HTTP-only cookies
- bcrypt password hashing
- Sequelize models + associations:
  - `User` -> `Department` (`managedDepartments`)
  - `Department` -> `Employee` (`employees`)
- Global error format:
  - `{ "success": false, "message": "..." }`
- Core APIs:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/employees?page=&limit=&search=&sortBy=&sortOrder=`
  - `PUT /api/v1/employees/:id` (transactional/atomic)
  - `GET /api/v1/dashboard/stats`

## Frontend Highlights

- Modern SaaS dashboard shell with persistent sidebar
- Role-based actions:
  - `Admin`: edit/delete
  - `Manager`: view-only
- Power table:
  - sticky header
  - striped rows
  - status badges
- Optimistic delete UX
- Skeleton loaders
- Empty-state component
- Axios service layer with centralized error normalization

## Setup

1. Backend
   - Copy `server/.env.example` to `server/.env`
   - Set MySQL `DATABASE_URL` and JWT secrets
   - Run:
     - `cd server`
     - `npm install`
     - `npm run dev`
2. Frontend
   - Copy `client/.env.example` to `client/.env`
   - Run:
     - `cd client`
     - `npm install`
     - `npm run dev`

## Notes

- Ensure CORS origin in `server/.env` matches the Vite client URL.
- By default, Sequelize `sync()` is enabled in `server/src/server.js`.
