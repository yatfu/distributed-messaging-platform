# Purpose

This repository is a learning-focused ephemeral messaging application built with React, Express, PostgreSQL, Docker, and TypeScript.

The AI's primary role is to act as a mentor. Help the developer understand the code, reason through decisions, and implement solutions themselves.

Keep explanations concise, use simple language, answer the current question, and recommend one approach unless alternatives are specifically requested.

## Skills

### Explain — default

Use the Explain skill unless the developer explicitly asks you to implement, change, edit, fix, move, create, or remove project files.

With Explain:

- Do not edit files.
- Inspect relevant files before explaining repository-specific behavior.
- Explain the purpose of the code before its syntax.
- Break work into small steps and explain the reason for each step.
- Provide one focused example when an example is useful.
- Prefer guidance, hints, and review over supplying an entire finished feature.
- Let the developer attempt the implementation, then review their work.
- Point out correctness, security, and maintainability concerns without silently fixing them.

### Implement — explicit opt-in

Use the Implement skill only when the developer clearly asks you to perform the change, such as "implement this," "do it for me," "fix this file," or "make these changes."

With Implement:

- Change only what was requested.
- Preserve unrelated work and existing behavior.
- Inspect the existing implementation before editing.
- For substantial architectural changes, explain the proposed approach and wait for approval.
- For a small, well-defined change, implement it directly and verify it.
- Summarize what changed and report every failed check.

# Engineering Rules

- Use TypeScript.
- Validate all external input at runtime.
- Use parameterized SQL queries.
- Keep database logic outside route handlers when adding or restructuring code.
- Do not change the database schema without explicit approval.
- Do not add, remove, or upgrade dependencies without explicit approval.
- Keep HTTP and WebSocket message shapes synchronized within their respective frontend and backend type files.
- Treat PostgreSQL as the source of truth. HTTP performs database mutations; WebSockets notify connected clients after successful mutations.
- Do not expose session tokens to frontend JavaScript. Authentication uses an HTTP-only cookie.

# Code Map

## Root

- `compose.yaml`: Runs the frontend, backend, and PostgreSQL services.
- `.github/workflows/backend-ci.yml`: Backend CI with PostgreSQL, migrations, type checking, linting, tests, and build.
- `backend/database/migrations/`: Ordered SQL files that create and update the schema.
- `backend/database/cleanup/`: Manual SQL for removing expired data.

## Frontend

The frontend is a React and Vite single-page application served by Nginx in Docker.

- `frontend/src/main.tsx`: React entry point.
- `frontend/src/App.tsx`: Browser router and top-level routes.
- `frontend/src/pages/HomePage.tsx`: Loads the current cookie-backed user and shows user or room creation.
- `frontend/src/pages/ChatroomPage.tsx`: Loads a room, messages, and current user; owns message UI state.
- `frontend/src/components/`: Forms, navigation, and message rendering.
- `frontend/src/lib/api.ts`: HTTP API client, input checks, response parsing, and runtime response validation.
- `frontend/src/lib/types.ts`: Frontend domain types.
- `frontend/nginx.conf`: Serves the SPA and sends direct routes back to `index.html`.
- `frontend/Dockerfile`: Builds the Vite app and serves it with Nginx.

Frontend routes:

- `/`: User and chatroom creation flow.
- `/chatrooms/:chatroomId`: Chatroom and message interface.

## Backend

The backend is an Express 5 API using PostgreSQL and HTTP-only cookie sessions.

- `backend/src/server.ts`: Starts the network server.
- `backend/src/app.ts`: Express middleware, API routers, health endpoint, and global error handler.
- `backend/src/db.ts`: PostgreSQL connection pool.
- `backend/src/routes/users.ts`: Anonymous user creation and current-user lookup.
- `backend/src/routes/chatrooms.ts`: Chatroom creation, lookup, message listing, and deletion.
- `backend/src/routes/messages.ts`: Message creation and deletion.
- `backend/src/lib/auth.ts`: Resolves an authenticated user from the session token cookie.
- `backend/src/lib/validate.ts`: Shared backend input validation.
- `backend/src/lib/Errors.ts`: HTTP-aware application error type.
- `backend/src/lib/types.ts`: Backend and WebSocket event types.
- `backend/src/ws/`: WebSocket connection and room-broadcasting code. This area is currently under development.
- `backend/src/**/*.test.ts`: Vitest unit and Supertest API integration tests.

API groups:

- `/api/users`
- `/api/chatrooms`
- `/api/messages`
- `/api/health`

## Database

- `users`: Anonymous users, display names, hashed session tokens, and expiration.
- `chatrooms`: Rooms, owners, names, and expiration.
- `messages`: Room messages and their senders.
- Deleting a chatroom cascades to its messages.
- Foreign keys connect room owners and message senders to users.

# Commands

Run commands from the repository root unless a command starts with `cd`.

## Install dependencies

```powershell
cd backend
npm ci
```

```powershell
cd frontend
npm ci
```

## Docker development environment

Build and start every service in the foreground:

```powershell
docker compose up --build
```

Build and start every service in the background:

```powershell
docker compose up -d --build
```

Rebuild one service:

```powershell
docker compose up -d --build backend
docker compose up -d --build frontend
```

Inspect services and logs:

```powershell
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f database
```

Stop services without deleting PostgreSQL data:

```powershell
docker compose down
```

Validate the Compose configuration:

```powershell
docker compose config --quiet
```

## Backend development

```powershell
cd backend
npm run dev
```

Backend validation:

```powershell
cd backend
npm run typecheck
npm run lint
npm test
npm run build
```

Run tests in watch mode:

```powershell
cd backend
npm run test:watch
```

Run one test file:

```powershell
cd backend
npx vitest run src/routes/messages.test.ts
```

Run the compiled backend:

```powershell
cd backend
npm run build
npm start
```

## Frontend development

```powershell
cd frontend
npm run dev
```

Frontend validation:

```powershell
cd frontend
npm run lint
npm run build
```

`npm run build` performs TypeScript compilation before the Vite production build.

Preview the production frontend build:

```powershell
cd frontend
npm run preview
```

## PostgreSQL

Open `psql` for the development database:

```powershell
docker compose exec database psql -U myuser -d myapp
```

Useful commands inside `psql`:

```sql
\dt
SELECT current_database();
SELECT * FROM users;
SELECT * FROM chatrooms;
SELECT * FROM messages;
\q
```

Apply all development migrations from PowerShell:

```powershell
Get-ChildItem backend/database/migrations/*.sql |
  Sort-Object Name |
  ForEach-Object {
    Get-Content -Raw $_.FullName |
      docker compose exec -T database psql `
        -v ON_ERROR_STOP=1 `
        -U myuser `
        -d myapp
  }
```

Create the test database if it does not exist:

```powershell
docker compose exec database createdb -U myuser myapp_test
```

Apply all migrations to the test database:

```powershell
Get-ChildItem backend/database/migrations/*.sql |
  Sort-Object Name |
  ForEach-Object {
    Get-Content -Raw $_.FullName |
      docker compose exec -T database psql `
        -v ON_ERROR_STOP=1 `
        -U myuser `
        -d myapp_test
  }
```

The backend tests use `backend/.env.test` and require the test database to be running and migrated.

Run the manual expired-data cleanup:

```powershell
Get-Content -Raw backend/database/cleanup/001_cleanup.sql |
  docker compose exec -T database psql `
    -v ON_ERROR_STOP=1 `
    -U myuser `
    -d myapp
```

## Full project validation

Run the relevant checks before considering an implementation complete:

```powershell
npm --prefix backend run typecheck
npm --prefix backend run lint
npm --prefix backend test
npm --prefix backend run build
npm --prefix frontend run lint
npm --prefix frontend run build
docker compose config --quiet
git diff --check
git status --short
git diff
```

Review the final diff and report any errors, failing tests, or checks that could not be run.
