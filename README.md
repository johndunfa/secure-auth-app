# 🔐 Secure User Authentication

A full-stack TypeScript authentication system built with Next.js, Express, and MongoDB Atlas. Features secure password hashing, JWT sessions via HTTP-only cookies, protected API routes, and a modern Tailwind CSS interface.

## 🌐 Live Demo

| Service | URL |
| :--- | :--- |
| **Frontend (Vercel)** | `https://your-vercel-app.vercel.app` |
| **Backend (Render)** | `https://your-render-app.onrender.com` |
| **Health Check** | `https://your-render-app.onrender.com/api/health` |

> ⚠️ **Note:** The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request may take 30–60 seconds to wake up.

---

## ✨ Features

- **Authentication:** Registration, Login, Logout, Protected Routes.
- **Security:** Passwords hashed with bcrypt (12 rounds), JWT in HTTP-only cookies, CORS with credentials, Zod input validation, and user enumeration prevention.
- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS, responsive design, loading & error states.
- **Backend:** Express.js, TypeScript, Mongoose, MongoDB Atlas.

---

## 🛠 Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS
**Backend:** Node.js, Express.js, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs, Zod
**Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

---

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | ❌ | Health check |
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login (sets HTTP-only cookie) |
| `POST` | `/api/auth/logout` | ❌ | Clear the auth cookie |
| `GET` | `/api/auth/me` | ✅ | Get authenticated user |
| `GET` | `/api/protected` | ✅ | Sample protected data |

### Example Authenticated Request
```http
GET /api/auth/me
Cookie: auth_token=<JWT>