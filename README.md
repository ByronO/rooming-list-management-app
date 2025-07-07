# Rooming List Management App

This is a full-stack web application to manage hotel rooming lists for event bookings. It includes a PostgreSQL database, a Node.js/Express backend, and a React frontend styled with Material UI.

---

## Tech Stack

- **Frontend:** React + Vite + Material UI
- **Backend:** Node.js + Express + JWT Auth + PostgreSQL
- **Database:** PostgreSQL (with Docker init script)
- **Testing:** Jest + Supertest
- **DevOps:** Docker + Docker Compose

---

## Project Structure

```
rooming-list-management-app/
├── db.sql                    # SQL script to initialize the database
├── docker-compose.yml       # Multi-service orchestration
├── rooming-list-api/        # Node.js backend
├── rooming-list-frontend/   # React + Vite frontend
```

---

## Getting Started (Docker)

> Prerequisites: Docker and Docker Compose installed

1. Clone the repo

```bash
git clone https://github.com/ByronO/rooming-list-management-app.git
cd rooming-list-management-app
```

2. Start all services (frontend, backend, db)

```bash
docker-compose up --build
```

3. Access the app:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:4000/api](http://localhost:4000/api)

---

## Auth

- Login endpoint: `POST /auth/login`
- Credentials:
  - **Username:** admin
  - **Password:** password123

All endpoints are protected with JWT.

---

## Testing (Backend)

1. Enter the backend container or run locally

```bash
cd rooming-list-api
npm test
```

Tests are written using `jest` and `supertest`, and validate key endpoints and auth.

---

## Database Initialization

When starting for the first time, the containerized PostgreSQL instance will:

- Create `rooming_list_app` database
- Run `db.sql` to create all required tables

To force reinit:

```bash
docker-compose down -v
docker-compose up --build
```

---

## Key Design Decisions

### Backend

- JWT used for stateless auth, with login hardcoded for simplicity
- Tests implemented with isolated logic, token validation, and error cases

### Frontend

- Built with **Vite** for performance and fast dev reloads
- **Material UI** with a custom theme for visual consistency with Figma
- State managed with React Context and Hooks (no Redux overhead)
- Search uses **debounce** to avoid unnecessary renders/API calls
- Scroll, filters, sort and grouping fully handled client-side
