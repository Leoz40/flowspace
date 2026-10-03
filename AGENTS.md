# FlowSpace (Astro + React)

## Developer Commands

- `npm run dev` — start Astro dev server (`http://localhost:4321`)
- `npm run build` — build for production
- `npm run preview` — preview production build locally

## Quality Gates

- `npm run lint` — run ESLint on `.js, .ts, .jsx, .tsx` files
- `npm run typecheck` — run TypeScript type checking via `tsc --noEmit`
- `npm run format` — format code with Prettier
- `npm run prepare` — initialize Husky git hooks (run on first clone)

## Project Structure

- `src/pages/` — Astro page routes. `src/pages/modulo/[moduleId].astro` uses dynamic routing.
- `src/pages/api/` — API routes. Auth endpoints: `login.ts`, `logout.ts`.
- `src/middleware.ts` — Auth middleware. Public routes: `/login`, `/api/auth/login`, `/_astro`, and any path with a `.` (assets). Requires `auth_session` cookie for all other routes; redirects to `/login` if missing.
- `src/lib/auth.ts` — Auth logic. Uses **mock** users with hardcoded bcrypt hash (password: `demo123`). Session store is in-memory `Map` (lost on restart).
- `src/styles/global.css` — Global CSS vars and body reset. No CSS-in-JS by default.
- `src/components/` — React components (currently empty; add as JSX/TSX).
- `src/data/` — Knowledge‑base modules (currently empty; populate per the project's module schema).
- `src/layouts/Layout.astro` — Must exist; the root layout for all pages.

## Key Conventions

- `type: "module"` in `package.json` — use ESM imports only.
- `tsconfig.json` extends `astro/tsconfigs/strict` with `jsx: "react-jsx"` and `jsxImportSource: "react"`.
- Astro integrations: `react()` from `@astrojs/react` (defined in `astro.config.mjs`).
- Middleware **must** return `next()` for authenticated paths; returning `redirect('/login')` is the unauthenticated flow.
- bcrypt hash in `src/lib/auth.ts:5` is a demo value (`demo123`). Do not use in production.
- ESLint and Prettier are enforced via Husky pre-commit hook.

## Adding New Pages / Components

1. Create `.astro` file in `src/pages/` — Astro auto‑routes by filename.
2. Create `.tsx` file in `src/components/` — import into pages or use directly.
3. For API routes, add under `src/pages/api/` (e.g., `src/pages/api/foo.ts`).

## Testing / Verification

- Run `node verificar-arquivos.cjs` from the repo root to check that all expected files are present (converted from `.js` to `.cjs` for ESM compatibility).
- No test framework or CI config is defined yet. Add Vitest or Jest if needed.

## Deployment

- `npm run build` generates static assets in `dist/`.
- `npm run preview` serves the build locally before deploying.
- No Docker or infra scripts are configured in this repo.
