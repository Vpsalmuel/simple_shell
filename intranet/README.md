# Rex Hub — Rex Insurance intranet

React + Vite + Tailwind CSS v4 front end for the Rex Insurance intranet.

## Run it

```bash
cd intranet
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Use **account menu → View as** to preview each staff type (demo only; real sign-in will decide this).

## Staff types

**New staff** are held in a full-screen walkthrough at `/welcome` and cannot reach the rest of Rex Hub until it is complete. Steps unlock in order:

1. **Company profile**: intro, mission, vision, key figures, timeline
2. **MD's message**: welcome video (must be watched) and letter
3. **Values & culture**: every value card must be opened
4. **Meet the departments**: a culture video per department (all must be watched)
5. **Policies to sign**: scroll to the end, tick to agree, type full name to sign (timestamped)

After finishing, new staff land on their department's dashboard with a "first 90 days" banner.

**Existing staff** share one Home layout. KPIs (with 8-week sparklines), quick links and a featured widget change by department:

| Department | Featured widget |
| --- | --- |
| Claims | SLA queue |
| Underwriting | Referrals awaiting decision |
| Customer Care | Escalations |
| HR | Leave / training approvals (approve or decline) |
| Finance | Payments to approve |
| IT | Service health |

## Pages

| Page | Route | Highlights |
| --- | --- | --- |
| Home | `/` | Department dashboard, announcements, news, events RSVP, poll, kudos, celebrations |
| People | `/people` | Search, department filter, grid/list, profile slide-over |
| Claims & Policy | `/claims` | Claim tracker, weekly chart (hover tooltips + table view), settlement trend vs target, SLA work queue, core systems |
| Docs & HR | `/docs` | Leave request, IT ticket, payslips, leave balances, document library with pinning |

Global: ⌘K / Ctrl+K search, notifications, dark mode, responsive layout, reduced-motion support.

## Where to change things

| What | File |
| --- | --- |
| Brand colors and chart colors | `src/index.css` (`@theme`) |
| Company name, logo files | `src/config/brand.js`, `public/rex-logo-*.svg` |
| Department KPIs, links, widgets | `src/config/departments.js` |
| Walkthrough copy, videos, policies | `src/data/onboarding.js` (set each video's `src` to a real file/URL) |
| News, people, events, documents | `src/data/index.js` (set a news `image` to show a photo) |
| Demo personas | `src/context/UserContext.jsx` |

Chart colors were checked for colorblind separation: `#3A5092` / `#EA580C` on light surfaces, `#566DAD` / `#EA580C` on dark.

Walkthrough progress and other demo state are stored in the browser (`localStorage`). In production, progress and signatures must be saved server-side as an audit record.
