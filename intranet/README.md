# Rex Hub — Rex Insurance intranet

React + Vite + Tailwind CSS v4 front end for the Rex Insurance intranet.

## Run it

```bash
cd intranet
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## What's inside

| Page | Route | Highlights |
| --- | --- | --- |
| Home | `/` | Greeting, rotating announcements, KPI cards, quick links, filterable news with likes, event RSVPs, pulse poll, kudos wall (give kudos modal), celebrations |
| People | `/people` | Search by name/role/skill/city, department filter, grid/list toggle, slide-over profile with contact actions and direct reports |
| Claims & Policy | `/claims` | Claim tracker with stage stepper, weekly opened/closed chart, claims by line, SLA-sorted work queue, core systems launcher |
| Docs & HR | `/docs` | Leave request (auto day count), IT ticket, payslips, leave balances, searchable document library with pinning |

Global: ⌘K / Ctrl+K command palette (pages, people, documents, claims), notifications, dark mode, responsive sidebar drawer, toasts. Likes, RSVPs, poll votes, pins and theme persist in `localStorage`.

## Customising

- **Brand colors** — `src/index.css`, `@theme` block (`brand-*` = primary `#1E2D64`, `accent-*` = secondary `#EA580C`).
- **Name & logo** — `src/config/brand.js`. Put the official logo file in `public/` and set `logo: '/rex-logo.png'`; until then an SVG redraw (`src/components/Logo.jsx`) is used.
- **Content** — all sample data is in `src/data/index.js`. Replace with API calls (SharePoint/Graph, HRIS, claims system) when wiring a backend.
- **Icons** — referenced by name from data; register new ones in `src/components/Icon.jsx`.
