# Validation

Run checks relevant to the implementation. Run commands from the repository root.

Backend validation:

```powershell
npm --prefix backend run typecheck
npm --prefix backend run lint
npm --prefix backend test
npm --prefix backend run build
```

Run backend tests in watch mode:

```powershell
cd backend
npm run test:watch
```

Run one backend test file:

```powershell
cd backend
npx vitest run src/routes/messages.test.ts
```

Frontend validation:

```powershell
npm --prefix frontend run lint
npm --prefix frontend run build
```

`npm --prefix frontend run build` performs TypeScript compilation before the Vite production build.

Validate Docker Compose when Docker configuration changes:

```powershell
docker compose config --quiet
```

Review every final change:

```powershell
git diff --check
git status --short
git diff
```

Report all errors, failing tests, and checks that could not be run.
