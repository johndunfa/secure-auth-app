# 🔐 Secure User Authentication

A production-ready full-stack authentication system built with Next.js, Express, TypeScript, and MongoDB Atlas. Delivers secure password hashing, JWT sessions via HTTP-only cookies, protected API routes, and a modern Tailwind CSS interface.

## 🌐 Live Demo

| Service | URL |
| :--- | :--- |
| **Frontend** | https://secure-auth-app-skir-eosin.vercel.app |
| **Backend API** | https://secure-auth-app-2.onrender.com |
| **Health Check** | https://secure-auth-app-2.onrender.com/api/health |

---

## ✨ Features

- **Full-Stack TypeScript** — end-to-end type safety across frontend and backend.
- **Secure Authentication** — Registration, Login, Logout, and Protected Routes.
- **Password Hashing** — bcrypt with 12 salt rounds before storage.
- **JWT Sessions** — Signed tokens delivered via HTTP-only cookies.
- **Input Validation** — Zod schemas validate every request on the server.
- **Protected API Routes** — Authentication middleware guards private endpoints.
- **Modern UI** — Tailwind CSS dark theme with responsive layout.
- **Loading & Error States** — Smooth UX on every form and action.
- **Cloud Persistence** — Data stored in MongoDB Atlas.
- **CI/CD Deployed** — Frontend on Vercel, backend on Render.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB Atlas, Mongoose |
| **Security** | JWT, bcryptjs, Zod, cookie-parser, CORS |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

## 🏗 Architecture

---

## 📁 Project Structure

---

## 🔌 API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | ❌ | Health check |
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login — sets HTTP-only cookie |
| `POST` | `/api/auth/logout` | ❌ | Clear the auth cookie |
| `GET` | `/api/auth/me` | ✅ | Get authenticated user |
| `GET` | `/api/protected` | ✅ | Sample protected data |

---

## 🔐 Example Authenticated Request

**Request**
```http
GET /api/auth/me HTTP/1.1
Host: secure-auth-app-2.onrender.com
Cookie: auth_token=<JWT>

{
  "user": {
    "id": "665f1c2ab8f1a2e4d9c3b7a1",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}
{
  "message": "Not authenticated. Please log in."
}

🚀 Getting Started (Local Setup)
1. Backend Setup
bash
cd server
npm install
Create server/.env:

env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/secure_auth
JWT_SECRET=<64_char_random_hex>
CLIENT_URL=http://localhost:3000
Start the backend:

bash
npm run dev
2. Frontend Setup
bash
cd client
npm install
Create client/.env.local:

env
NEXT_PUBLIC_API_URL=http://localhost:5000
Start the frontend:

bash
npm run dev
Open http://localhost:3000.

🚢 Deployment
Frontend: Deployed on Vercel — auto-deploys on every push to main.

Backend: Deployed on Render — auto-deploys on every push to main.

Database: Hosted on MongoDB Atlas — cloud-managed, secure, and scalable.

👤 Author
Yohanis Dunfa

GitHub: @johndunfa

Email: yohanisdunfa09@gmail.com