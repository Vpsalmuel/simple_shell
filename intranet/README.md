# Rex Hub: Rex Insurance intranet

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

## Guided tour

On a person’s first visit (and for new staff right after onboarding) a 6-step tour highlights the menu, search, quick tools, Rex AI and the profile menu. It shows once per person and can be replayed from **account menu → Take the tour**.

## Third-party apps

**Book a room** (Home, Quick tools) opens a pop-up telling people it goes to SeamlessHR. Optionally set `externalApps.seamlessHr.url` in `src/config/brand.js` to add a “Continue to SeamlessHR” button.

Placeholders still to replace: most birthdays, the HMO and counsellor phone numbers, the REAP link and the Gym Champion (`src/data/culture.js`), the Kissflow, IES and Payslips links (`src/config/brand.js`), the dress code wording and the Bond product variants (`src/data/onboarding.js`).

## Rex AI

A chat assistant (bottom-right button) powered by Google Gemini, as in the AI Studio prototype. The browser calls `/api/chat` on our own server (`server/index.js`), which holds the API key; the key is never sent to the browser.

- `GEMINI_API_KEY`: required for AI answers. Without it, Rex AI runs in **offline mode**: it gives directions to the right page (from `src/config/siteGuide.js`), then answers from the Knowledge Center and FAQs.
- Rex AI also guides navigation: ask “Where do I find my payslip?” and it names the page, where it is in the menu, and links to it. The same site map is in the Gemini instructions.
- `GEMINI_MODEL`: optional; defaults to the prototype's model.
- The shareable preview has no server, so it always runs in offline mode.

## Sign-in (Microsoft single sign-on)

Everyone starts at `/login` and signs in with **Sign in with Microsoft**.

- **Demo mode (default):** with no Azure settings, the button opens a clearly labelled picker of demo colleagues, and **account menu → View as** switches between them.
- **Microsoft mode:** your IT team registers Rex Hub in **Microsoft Entra ID** (App registrations → New registration → platform **Single-page application**, redirect URI = your site's address, e.g. `https://hub.rexinsurance.com`; API permission **Microsoft Graph → User.Read**, delegated). Put the **Application (client) ID** and **Directory (tenant) ID** in `.env` as `VITE_AZURE_CLIENT_ID` and `VITE_AZURE_TENANT_ID`, then rebuild. Names, job titles and departments then come from Microsoft, and "View as" disappears.
- **New staff sign in with Microsoft too.** Rex Hub treats anyone whose Microsoft 365 **hire date** (`employeeHireDate`) is within the last 90 days as new staff and sends them straight to onboarding until it is complete. HR/IT must fill in the hire date on each new account (change the 90 days in `NEW_STAFF_DAYS`, `src/context/UserContext.jsx`).
- The Microsoft path is built on Microsoft's official MSAL library (`src/auth/microsoft.js`) but has not been tested against your tenant yet.

## Staff types

**New staff** are held in a full-screen walkthrough at `/welcome` and cannot reach the rest of Rex Hub until all 12 steps are complete. Steps unlock in order; those marked ✱ have a requirement before **Continue** works:

1. MD's welcome ✱ (watch the video)
2. Company overview
3. Our values ✱ (open each value)
4. Culture & dress code
5. Insurance products ✱ (open each product)
6. Office locations (your team's floor is highlighted)
7. HR & IT policies ✱ (scroll to the end, agree, type full name to sign)
8. Your tools & IT setup ✱ (tick MFA, email and Teams)
9. Performance management
10. Meet your team (line manager and onboarding buddy)
11. Meet the departments ✱ (watch every culture video)
12. Schedule buddy feedback ✱ (book a check-in, Monday to Friday only)

The step list scrolls inside its own panel and keeps the current step in view.

After finishing, new staff land on their department's dashboard with a "first 90 days" banner naming their buddy and manager.

**Existing staff** share one Home layout. **Quick tools** (Emails, Kissflow, IES, Help Desk, Book a room, Payslips) are the same for everyone; set their links in `companyTools` in `src/config/brand.js` (a tool with `url: null` shows a "link coming soon" notice). The tasks in **Your tasks** change by department:

| Department | Featured widget |
| --- | --- |
| Claims | Team reminders (claims work itself happens in the productivity tool, outside Rex Hub) |
| Underwriting | Referrals awaiting decision |
| Customer Care | Escalations |
| HR | Leave / training approvals (approve or decline) |
| Finance | Payments to approve |
| IT | Service health |

## Pages

Sidebar groups (from `src/config/nav.js`): **Workspace** (Home, News, Events, Celebrations) · **Self-service** (Knowledge & Learning, Help Desk) · **Company** (Departments, Health & Wellbeing) · **Management** (Admin Workspace).

Restricted items are hidden from the menu and search, and their address shows a "no access" page:
- Admin Workspace: HR, IT, Brand & Communications, Executive Office

| Page | Route | Highlights |
| --- | --- | --- |
| Sign in | `/login` | Two layouts for review (split screen, full image), switched from the top-left control. Remove the switch once one is chosen |
| Home | `/` | Greeting, one dismissible notice, **Your tasks** (pending approvals, team items, required training, waiting requests), company news (featured + list), upcoming events; right rail: **Quick tools**, **Celebrations**, pulse poll |
| News | `/news`, `/news/:id` | Featured story, category filter, search, article page with likes, comments and a simple "More stories" list |
| Events | `/events` | Ruled month calendar, type filters, RSVP, upcoming list |
| Celebrations | `/celebrations` | Recognition and kudos with reactions and comments, birthdays, work anniversaries, new joiners. Admins can share recognition. Replaces Milestones |
| Knowledge & Learning | `/knowledge`, `/knowledge/:id` | Tabs: Policies & guides, Courses (required + catalogue), Documents (pin up to three) |
| Course player | `/learning/:id` | Video, lesson list with progress, overview and other courses. Lessons are in `lessonTitles` in `src/data/index.js` |
| Help Desk | `/help` | One place for help and requests: photo cards for **IT**, **HR**, **Admin** and **Brand** open a request form; your requests (mine, team queue, open, resolved) with a detail panel, comments and history; common questions. Replaces the separate Requests page, which shared the same ticket store |
| Departments | `/departments`, `/departments/:id` | Each team: culture video, head, services, team, documents, events |
| Health & Wellbeing | `/wellbeing` | REAP mental-health programme, HMO and fitness info, Gym Champion of the month, daily checklist, monthly hike |
| Admin Workspace | `/admin` | Publish news to News and the Home feed, open requests by team |

Retired pages redirect: `/requests` → Help Desk (keeps `?tab=` and `?id=`), `/docs` → Documents, `/learning` → Courses, `/milestones` → Celebrations, `/rewards` → Health & Wellbeing, `/people` → Home.

Also: a birthday and anniversary pop-up with confetti (once a day), and a profile photo people can change from the account menu.

## Design system

Calm workspace style with light motion: cards lift and their photos ease in on hover, lists fade in one after another, and an orange line marks the hovered and current sidebar item (all off under reduced motion). 15px root size (type scale 12 / 13 / 15 / 17 / 22 / 28), one radius scale (12px surfaces, 8px controls), hairline borders instead of shadows, a light sidebar, one page header component (`src/components/PageHeader.jsx`), and a 1200px content width. Utilities (`card`, `btn-primary`, `btn-secondary`, `section-title`, `link`) are in `src/index.css`.

Global: search field in the header on every page (⌘K / Ctrl+K), notifications, dark mode, responsive layout, reduced-motion support.

## Shareable preview

`npm run build:preview` builds one self-contained HTML file (`dist-preview/rex-hub.html`) that routes in memory, for hosting as a single page.

## Where to change things

| What | File |
| --- | --- |
| Brand colors and chart colors | `src/index.css` (`@theme`) |
| Company name, logo files | `src/config/brand.js`, `src/assets/rex-logo-*.svg` |
| Sidebar items and who can see them | `src/config/nav.js` |
| Department tasks widget | `src/config/departments.js` |
| Walkthrough copy, videos, policies | `src/data/onboarding.js` (set each video's `src` to a real file/URL) |
| News, events, courses, people, documents | `src/data/index.js` (set a news `image` to show a photo) |
| Department pages | `departmentTour` in `src/data/onboarding.js` |
| Demo personas (incl. buddy and manager) | `src/context/UserContext.jsx` |
| Help Desk desks and sample requests | `src/data/requests.js` |
| Photos (news, courses, wellbeing, help desks, departments) | `src/data/photos.js`, `src/assets/photos/` |
| Knowledge articles, Help Desk FAQs | `src/data/knowledge.js` |
| Onboarding content (products, floors, IT setup…) | `src/data/onboarding.js` |
| Recognition, birthdays, wellbeing, REAP, Gym Champion | `src/data/culture.js` |
| Where Rex AI sends people | `src/config/siteGuide.js` |
| SeamlessHR link, Quick tools (Emails, Kissflow, IES) links | `src/config/brand.js` |

Chart colors were checked for colorblind separation: `#3A5092` / `#EA580C` on light surfaces, `#566DAD` / `#EA580C` on dark.

**Contrast.** Text meets WCAG AA (4.5:1) in light and dark mode. White text never sits on `#EA580C` (3.6:1); buttons and badges use `accent-700` `#C2410C` (5.2:1), and the brand orange stays for accents and icons. `src/index.css` raises muted greys in dark mode, unless an element sets its own `dark:text-*` colour.

**Icons** are [Phosphor](https://phosphoricons.com) (`@phosphor-icons/react`, regular weight). Data files name icons as strings; map new ones in `src/components/Icon.jsx`.

Walkthrough progress, requests, published news and other demo state are stored in the browser (`localStorage`). In production they must be saved server-side (signatures as an audit record).

## Origin

The Request Centre, Knowledge Center, Help Desk, buddy, Admin Workspace, Rex AI and the extra onboarding steps were merged in from the AI Studio prototype (`Vpsalmuel/intranet-alpha-web`), rebuilt in this project's design system. People's names, roles, bios and joining dates come from the prototype's roster; Ibrahim Musa (Actuarial) and David Okon (Legal & Compliance) are placeholders because the prototype had no one in those teams.
