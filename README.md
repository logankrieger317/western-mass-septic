# Western Mass Septic — Landing + CRM

Monorepo for **Western Mass Septic**: a public landing page and an internal CRM, following the same patterns as [small-biz-crm](https://github.com/your-org/small-biz-crm) and aligned with [Patterns-And-Standards](https://github.com/your-org/Patterns-And-Standards).

## Structure

- **`apps/landing`** — React + Vite + Tailwind. Public site: hero, services, about, testimonials, FAQ, contact form. Content and theme from `config/`.
- **`apps/crm`** — React + Vite + MUI. Dashboard, pipeline (Kanban), leads, activities, calendar, settings. Auth via JWT.
- **`apps/api`** — Express + Prisma. REST API: auth, leads, notes, activities, calendar, documents, contact form submission, dashboard stats.
- **`config/`** — Company branding, theme, pipeline stages, lead fields, and landing copy (single source of truth).
- **`packages/shared`** — Shared TypeScript types and Zod schemas.
- **`prisma/`** — PostgreSQL schema and seed.

## Prerequisites

- Node ≥18  
- pnpm 9.x  
- PostgreSQL

## Setup

```bash
# Install dependencies
pnpm install

# Copy env and set DATABASE_URL
cp .env.example .env

# Generate Prisma client and push schema
pnpm db:generate
pnpm db:push

# Seed (creates admin@westernmassseptic.com / admin123)
pnpm db:seed
```

## Develop

```bash
# Run API (port 3001), landing (5173), and CRM (5174)
pnpm dev
```

- Landing: http://localhost:5173  
- CRM: http://localhost:5174 (login with seeded admin)  
- API: http://localhost:3001 (e.g. `/api/health`)

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `pnpm dev`     | Run all apps in dev mode   |
| `pnpm build`   | Build all apps             |
| `pnpm db:generate` | Prisma generate        |
| `pnpm db:push` | Prisma db push             |
| `pnpm db:migrate` | Prisma migrate dev     |
| `pnpm db:seed` | Seed database              |
| `pnpm db:studio` | Prisma Studio            |

## Patterns & standards

- **Backend (API):** Follow [Patterns-And-Standards](https://github.com/your-org/Patterns-And-Standards) — Claims / Service-Template for routes, handlers, services, naming (kebab-case folders, `*.handler.ts`, `*.service.ts`).
- **Frontend:** Component and state patterns from Tenant-Portal / Frontend-Safelease where applicable; config-driven theme and content from `config/`.

## Deploy on Railway (customer demo)

1. In [Railway](https://railway.app), **New Project** → **Deploy from GitHub** → select `western-mass-septic`.
2. Add **PostgreSQL** (Railway will set `DATABASE_URL`).
3. For the **API service** (recommended for a full demo):
   - **Root directory:** leave blank (monorepo root).
   - **Build:** Railpack auto-runs `pnpm --filter @western-mass-septic/api build` (this now builds config + shared first, then the API).
   - **Start:** `pnpm --filter @western-mass-septic/api start` (serves `node dist/index.js`).
   - **Variables:** ensure `DATABASE_URL` is set (auto from PostgreSQL). In Railway shell, run `pnpm db:push && pnpm db:seed` once to apply schema and seed data.
4. Optionally add separate services for **landing** and **CRM** (static or Node), or build and serve them from the same project.

## Customization

- **Branding & pipeline:** Edit `config/company.ts` (name, contact, theme, pipeline stages, lead fields).
- **Landing copy & sections:** Edit `config/content.ts` and the `sections` array.

## License

Private / internal use.
