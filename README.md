# User Service

A **Node.js** microservice for user authentication and management in the Movie Booking System. It handles public signups, logins, role-based access (public/admin), and inter-service token verification.

---

## Table of Contents

- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Service](#running-the-service)
- [API Endpoints](#api-endpoints)
  - [Public Register](#public-register)
  - [Public Login](#public-login)
  - [Logout (Invalidate)](#logout-invalidate)
  - [Create Admin](#create-admin)
  - [Get User Profile](#get-user-profile)
  - [Delete User](#delete-user)
  - [Verify Token & Role](#verify-token--role)
- [Error Handling](#error-handling)
- [License](#license)
- [Author](#author)

---

## Description

This service provides user management features:

- **Public Users**: Register, login, view own data, logout.
- **Admin Users**: Create other admin accounts, delete any user.
- **Inter-Service Auth**: Verify JWT and enforce role-based access for other microservices.

Built with **Express.js**, **Mongoose** (MongoDB), and **JWT**.

---

## Prerequisites

- **Node.js** (v16+)
- **npm** (v8+)
- **MongoDB** instance (Cloud or local)
- **Redis** (optional, for caching/pub-sub)

---

## Installation

```bash
# Clone the repo
git clone <repo-url> && cd user-service

# Install dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the root with:

```dotenv
PORT=5000
MONGODB_URI=mongodb://localhost:27017/userdb
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379   # optional
```

---

## Running the Service

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

Service listens on `http://localhost:${process.env.PORT || 5000}` by default.

---

## API Endpoints

### Public Register

- **Endpoint:** `POST /users`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "superSecret123"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "userId": "<uuid>",
    "accessToken": "<jwt>",
    "expiresIn": 3600
  }
  ```

### Public Login

- **Endpoint:** `POST /auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "hunter2"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "accessToken": "<jwt>",
    "expiresIn": 3600
  }
  ```

### Logout (Invalidate)

- **Endpoint:** `DELETE /auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** *(optional)*
  ```json
  {
    "refreshToken": "<refresh_token>"
  }
  ```
- **Response:** `204 No Content`

### Create Admin

- **Endpoint:** `POST /admin/users`
- **Headers:**
  - `Authorization: Bearer <adminToken>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "John Admin",
    "email": "john.admin@example.com",
    "password": "adminStrong!@#"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "userId": "<uuid>",
    "role": "admin",
    "createdAt": "2025-04-19T12:34:56Z"
  }
  ```

### Get User Profile

- **Endpoint:** `GET /users/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Path Params:** `userId` (UUID)
- **Response:** `200 OK`
  ```json
  {
    "userId": "<uuid>",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "public"
  }
  ```

### Delete User

- **Endpoint:** `DELETE /users/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Path Params:** `userId` (UUID)
- **Authorization:** Must be **admin** OR the **owner** of `:userId`
- **Response:** `204 No Content`

### Verify Token & Role

- **Endpoint:** `GET /auth/verify`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `role`=`public`|`admin`
- **Response:** `200 OK`
  ```json
  {
    "authorized": true,
    "userId": "<uuid>",
    "role": "admin"
  }
  ```

---

## Error Handling

| Status | Condition                               | Response                         |
|--------|-----------------------------------------|----------------------------------|
| 400    | Missing/invalid input                   | `{ "error": "Bad Request" }` |
| 401    | Missing/invalid JWT                     | `{ "error": "Unauthorized" }`|
| 403    | Insufficient permissions (role failed)  | `{ "error": "Forbidden" }`   |
| 404    | Resource not found (e.g., userId invalid)| `{ "error": "Not Found" }`   |
| 500    | Server or auth service error            | `{ "error": "Internal Server Error" }` |

---

## Author

**Hariharan S** – [GitHub Profile](https://github.com/2024tm93116-hariharan)

