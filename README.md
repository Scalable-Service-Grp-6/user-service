# User Service

A **Node.js** and **TypeScript** microservice for user authentication and management within the Movie Booking System. It provides public user registration, login, role-based access (public/admin), session management with JWTs, and inter-service authentication.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [License](#license)
- [Author](#author)

---

## Features

- **Public Registration & Login** with secure password hashing (bcrypt)
- **JWT-based Sessions** stored in MongoDB with TTL index for expiry
- **Role-Based Access Control** (`public` vs `admin`)
- **Single Active Session** per user (upsert logic)
- **Inter-Service Auth** endpoint to validate tokens & roles
- **Automatic DB Reconnect** on failures with retry logic

---

## Tech Stack

- Node.js & TypeScript
- Express.js
- MongoDB & Mongoose
- JWT (`jsonwebtoken`, `express-jwt`)
- Bcrypt for password hashing
- UUID for session IDs

---

## Prerequisites

- **Node.js** v16+ and **npm** v8+
- **MongoDB** Atlas or local instance
- (Optional) **Redis** for caching/pub-sub

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Scalable-Service-Grp-6/user-service.git
cd user-service

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the project root with these variables:

```dotenv
# HTTP ports
PORT=4000                     # Express app
INTERSERVICES_PORT=4001       # Optional inter-service endpoint prefix

# MongoDB Connection URI (Atlas)
MONGO_DB_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority"

# Retry settings
DB_CONNECTION_RETRY_TIMEOUT=5000  # ms between reconnect attempts

# JWT secret & expiry (in seconds)
SIGN_IN_SECRET_KEY="your_32_char_secret"
SIGN_TOKEN_EXPIRY=86400            # e.g., 24h
```

> ⚠️ **Security:** URL-encode special characters in `<password>`, and add `.env` to `.gitignore`.

---

## Running the Service

```bash
# Development (hot reload)
npm run dev

# Build and run production
npm run build
npm start
```

- **Dev server** runs via `ts-node-dev` and watches `src/` files
- **Compiled output** in `dist/` folder after `npm run build`

---

## API Endpoints

All endpoints accept and return JSON. Protected routes require `Authorization: Bearer <token>` header.

### Public User Routes

| Action                | Method | Path                  | Body / Query                          | Response                       |
|-----------------------|--------|-----------------------|---------------------------------------|--------------------------------|
| Register public user  | POST   | `/users`              | `{ name, email, password }`           | `201` Created user & tokens    |
| Login                 | POST   | `/auth/login`         | `{ email, password }`                 | `200` `{ accessToken, expiresAt }` |
| Logout                | DELETE | `/auth/logout`        | *Header:* `Authorization`             | `204` No Content               |

### Admin Routes

| Action                | Method | Path                   | Body                                  | Response                       |
|-----------------------|--------|------------------------|---------------------------------------|--------------------------------|
| Create admin user     | POST   | `/admin/users`         | `{ name, email, password }`           | `201` Created admin user       |

### User Management

| Action                | Method | Path                  | Header                                | Response                       |
|-----------------------|--------|-----------------------|---------------------------------------|--------------------------------|
| Get user profile      | GET    | `/users/:userId`      | `Authorization`                       | `200` User data                |
| Delete user           | DELETE | `/users/:userId`      | `Authorization` (admin or owner)      | `204` No Content               |

### Inter-Service Auth

| Action                | Method | Path                  | Header                                | Query                              | Response                             |
|-----------------------|--------|-----------------------|---------------------------------------|------------------------------------|--------------------------------------|
| Verify token & role   | GET    | `/auth/verify`        | `Authorization`                       | `?role=public|admin`               | `200` `{ authorized, userId, role }` |

---

## Error Handling

| Status | Condition                         | Response                         |
|--------|-----------------------------------|----------------------------------|
| 400    | Bad request or missing data       | `{ error: "Bad Request" }`     |
| 401    | Missing/invalid token, auth fail  | `{ error: "Unauthorized" }`    |
| 403    | Insufficient permissions          | `{ error: "Forbidden" }`       |
| 404    | Resource not found                | `{ error: "Not Found" }`       |
| 500    | Server or DB error                | `{ error: "Internal Server Error" }` |

---

## Project Structure

```
user-service/
├─ src/
│  ├─ controllers/           # Route handlers
│  │   ├ interservices.ts     # /auth/verify
│  │   ├ sessions.ts         # session login/logout
│  │   ├ userDataController.ts
│  │   └ userSessionController.ts
│  ├─ dto/                   # Type definitions for DTOs
│  ├─ models/                # Mongoose schemas & DB connect
│  ├─ properties/            # Config constants (e.g., JWT secrets)
│  ├─ routes/                # Route definitions
│  ├─ services/              # Business logic (userDataService, userSessionService)
│  ├─ utils/                 # Helpers (JWT extractors, validators)
│  ├─ app.ts                 # Express app setup
│  └─ server.ts              # Entry point & server start
├─ dist/                     # Compiled JS (after build)
├─ .env                      # Environment variables (ignored)
├─ package.json              # Scripts & dependencies ([github.com](https://github.com/Scalable-Service-Grp-6/user-service))
├─ tsconfig.json             # TypeScript config
└─ README.md                 # This file
```

## Author

**Hariharan S (Erebus)** – [GitHub Profile](https://github.com/Scalable-Service-Grp-6)