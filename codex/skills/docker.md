# Docker Development

Run these commands from the repository root.

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
