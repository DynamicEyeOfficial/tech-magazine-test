# PostgreSQL Migration Path

The current live runtime uses SQLite. PostgreSQL migration artifacts are prepared, and a PostgreSQL rehearsal adapter exists for schema/data import testing. The app must stay on SQLite until rehearsal and a full PostgreSQL smoke run pass.

## Current State

- SQLite runtime: active
- PostgreSQL generated schema: `database/postgres/schema.generated.sql`
- PostgreSQL starter schema: `database/postgres/schema.sql`
- Data export: `npm run db:export:postgres`
- Readiness check: `npm run db:postgres:check`
- Rehearsal import: `POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=<export> npm run db:postgres:rehearse`

## Safe Migration Flow

1. Keep `DATABASE_CLIENT=sqlite`.
2. Run `npm run db:schema:postgres`.
3. Run `npm run db:export:postgres`.
4. Provision PostgreSQL.
5. Set `POSTGRES_URL` only in a migration rehearsal environment.
6. Run `POSTGRES_CHECK_NETWORK=true npm run db:postgres:check`.
7. Install dependencies with `npm install` so the `pg` driver is available.
8. Run `POSTGRES_REHEARSAL_CONFIRM=true POSTGRES_IMPORT_JSON=<export> npm run db:postgres:rehearse`.
9. Run the full smoke suite against PostgreSQL.
10. Only then switch production to `DATABASE_CLIENT=postgres`.

## Important

Setting `DATABASE_CLIENT=postgres` before the migration rehearsal and PostgreSQL smoke suite pass intentionally stops the app. This prevents a false production launch where the environment says PostgreSQL but the code has not been proven against PostgreSQL.
