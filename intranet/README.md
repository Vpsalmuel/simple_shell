# Rex Hub — Rex Insurance intranet

React + Vite + Tailwind CSS v4 front end for the Rex Insurance intranet.

## Run it

```bash
cd intranet
npm install
cp .env.example .env   # add GEMINI_API_KEY to switch Rex AI on

# development: two terminals
npm run dev:api        # Rex AI server on :3001
npm run dev            # site on http://localhost:5173 (proxies /api to :3001)

# production
npm run build && npm start   # site + Rex AI on http://localhost:3001
```

## Rex AI

A chat assistant (bottom-right button) powered by Google Gemini, as in the AI Studio prototype. The browser calls `/api/chat` on our own server (`server/index.js`), which holds the API key; the key is never sent to the browser.

- `GEMINI_API_KEY`: required for AI answers. Without it, Rex AI runs in **offline mode** and answers from the Knowledge Center and FAQs.
- `GEMINI_MODEL`: optional; defaults to the prototype's model.
- The shareable preview has no server, so it always runs in offline mode.

Use **account menu → View as** to preview each staff type (demo only; real sign-in will decide this).

## Staff types

**New staff** are held in a full-screen walkthrough at `/welcome` and cannot reach the rest of Rex Hub until all 12 steps are complete. Steps unlock in order; those marked ✱ have a requirement before **Continue** works:

1. MD's welcome ✱ (watch the video)
2. Company overview
3. Our values ✱ (open each value)
4. Culture & workplace norms
5. Insurance products ✱ (open each product)
6. Office locations (your team's floor is highlighted)
7. Meet your team (line manager and onboarding buddy)
8. Meet the departments ✱ (watch every culture video)
9. HR & IT policies ✱ (scroll to the end, agree, type full name to sign)
10. Your tools & IT setup ✱ (tick MFA, email and Teams)
11. Performance management
12. Schedule buddy feedback ✱ (book a check-in)

After finishing, new staff land on their department's dashboard with a "first 90 days" banner naming their buddy and manager.

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

Sidebar groups (from `src/config/nav.js`): **Workspace** (Home, News, Events) · **Work** (Request Centre, Claims & Policy, Docs & HR) · **Knowledge** (Knowledge Center, Learning, Help Desk) · **Company** (Departments, People) · **Management** (Admin Workspace).

Restricted items are hidden from the menu and search, and their address shows a "no access" page:
- Claims & Policy: Claims and Underwriting
- Admin Workspace: HR, IT, Brand & Communications, Executive Office

| Page | Route | Highlights |
| --- | --- | --- |
| Home | `/` | Department dashboard, announcements, news, events RSVP, poll, kudos, celebrations |
| News | `/news`, `/news/:id` | Featured story, category filter, search, article page with likes and comments |
| Events | `/events` | Month calendar, type filters, RSVP, upcoming list |
| Departments | `/departments`, `/departments/:id` | Team directory; each team page has culture video, head, services, team, documents, events |
| Learning | `/learning` | Required compliance courses with due dates, progress, course catalogue |
| Request Centre | `/requests` | Requests between departments: tabs (mine, my team's queue, open, resolved), search, detail panel with comments and history; the receiving team can assign, progress, complete or reject |
| Knowledge Center | `/knowledge`, `/knowledge/:id` | Searchable wiki of policies, SOPs, guides and FAQs, with "was this helpful?" |
| Help Desk | `/help` | IT, HR, Finance and Facilities tickets (they land in the Request Centre), FAQs, my tickets |
| Admin Workspace | `/admin` | Publish news to News and the Home feed, open requests by team, overview figures |
| People | `/people` | Search, department filter, grid/list, profile slide-over |
| Claims & Policy | `/claims` | Claim tracker, weekly chart (hover tooltips + table view), settlement trend vs target, SLA work queue, core systems |
| Docs & HR | `/docs` | Leave request, IT ticket, payslips, leave balances, document library with pinning |

Global: ⌘K / Ctrl+K search, notifications, dark mode, responsive layout, reduced-motion support.

## Shareable preview

`npm run build:preview` builds one self-contained HTML file (`dist-preview/rex-hub.html`) that routes in memory, for hosting as a single page.

## Where to change things

| What | File |
| --- | --- |
| Brand colors and chart colors | `src/index.css` (`@theme`) |
| Company name, logo files | `src/config/brand.js`, `src/assets/rex-logo-*.svg` |
| Sidebar items and who can see them | `src/config/nav.js` |
| Department KPIs, links, widgets | `src/config/departments.js` |
| Walkthrough copy, videos, policies | `src/data/onboarding.js` (set each video's `src` to a real file/URL) |
| News, events, courses, people, documents | `src/data/index.js` (set a news `image` to show a photo) |
| Department pages | `departmentTour` in `src/data/onboarding.js` |
| Demo personas (incl. buddy and manager) | `src/context/UserContext.jsx` |
| Requests | `src/data/requests.js` |
| Knowledge articles, Help Desk FAQs | `src/data/knowledge.js` |
| Onboarding content (products, floors, IT setup…) | `src/data/onboarding.js` |

Chart colors were checked for colorblind separation: `#3A5092` / `#EA580C` on light surfaces, `#566DAD` / `#EA580C` on dark.

Walkthrough progress, requests, published news and other demo state are stored in the browser (`localStorage`). In production they must be saved server-side (signatures as an audit record).

## Origin

The Request Centre, Knowledge Center, Help Desk, buddy, Admin Workspace, Rex AI and the extra onboarding steps were merged in from the AI Studio prototype (`Vpsalmuel/intranet-alpha-web`), rebuilt in this project's design system.
