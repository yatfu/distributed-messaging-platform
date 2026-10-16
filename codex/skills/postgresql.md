# PostgreSQL

Run PowerShell commands from the repository root.

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

Apply all development migrations:

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
