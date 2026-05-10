# Fuel My Chai

A lightweight, UPI-based creator support platform for Indian creators.

## Monorepo

- `frontend` - React + Tailwind CSS, intended for Vercel
- `backend` - Node.js + Express + raw `pg`, intended for Render and Supabase

This phase sets up the monorepo, backend boilerplate, PostgreSQL migration, and frontend scaffold.

## Environment

Backend env variables live in `backend/.env`:

```env
DATABASE_URL=
JWT_SECRET=
DATA_ENCRYPTION_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
PORT=
```

Frontend env variables live in `frontend/.env`:

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_PUBLIC_BASE_URL=
```

## Local Development

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Run the SQL migration in `backend/db/migrations/001_create_users.sql` against your Railway PostgreSQL database before starting the backend with a real `DATABASE_URL`.

If you already have users before enabling encryption, run:

```bash
cd backend
npm run encrypt:backfill
```

For production, set `CLIENT_URL` on the backend to the deployed frontend origin and set `VITE_PUBLIC_BASE_URL` on the frontend to that same public origin.

`DATA_ENCRYPTION_KEY` is used to encrypt email and UPI IDs before storing them in PostgreSQL. Use a long random secret and keep it stable; changing it will make previously encrypted values unreadable.
