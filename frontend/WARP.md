`
# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.
``

Project overview
- Framework: Next.js (App Router), TypeScript, React 19
- Styling/UI: Tailwind CSS (via @tailwindcss/postcss) + MUI (@mui/material)
- HTTP: Axios with a preconfigured instance and request interceptor
- Toasts/UX: react-hot-toast and react-toastify
- Build/runtime: Node 20 (see Dockerfile), Next.js 15
- Path aliases: @/* -> ./src/* (see tsconfig.json)

Environment
- NEXT_PUBLIC_BACKEND_API_UR controls the API base URL used by the Axios instance. If not set, it defaults to http://localhost:5000. Set it in your shell before dev/build, e.g.:
  - bash: export NEXT_PUBLIC_BACKEND_API_UR="http://localhost:5000"

Common commands
- Install deps (clean, uses package-lock.json): npm ci
- Start dev server (Turbopack): npm run dev
- Lint: npm run lint
- Build: npm run build
- Start production server (after build): npm start

Docker
- Build: docker build -t clinic-frontend .
- Run: docker run --rm -p 3000:3000 clinic-frontend
  Notes: The current Dockerfile builds the app and runs npm start. NEXT_PUBLIC_* env vars are embedded at build time by Next.js; the Dockerfile does not define ARG/ENV passthrough for them. If you need a non-default API URL, set it in your environment before building the image.

Testing
- No test runner or configuration is present in this repository (no Jest/Vitest/Playwright). There is no single-test command.

Code architecture (big picture)
- App Router structure (src/app)
  - Routes are defined under src/app: e.g. / (page.tsx), /login, /register, /about-us, /book-appointment, /user-details, /admin-dashboard, etc.
  - Global layout (src/app/layout.tsx) wraps all pages with:
    - AppContextProvider: centralizes UI state (date/slot selection, login flags, role, scrolling ref) for the booking flow and user state.
    - Header and Footer components are conditionally rendered (hidden on admin-dashboard route segment).
    - Toaster is mounted globally for toast notifications.

- State and context (src/app/context/AppContext.jsx)
  - Provides selectedDate/selectedSlots, isLogin, userId, role, and helpers (handleScrollToForm) via React context.
  - Uses localStorage flags (isLogin, user info) to determine UI state.

- API layer
  - Base URL and endpoints: src/app/common/summary.api.ts defines baseUrl (from NEXT_PUBLIC_BACKEND_API_UR) and all endpoint paths/methods for auth, users, appointments, slots, billing, etc. This centralizes routes used throughout the UI.
  - Axios instance: src/app/utils/Axios.ts sets baseURL to baseUrl, withCredentials=true, a timeout, and a request interceptor that attaches Authorization: Bearer ${localStorage.auth_token} if present.
  - Toast helpers: src/app/utils/AxiosToastSended.ts wraps success/error toasts for Axios responses.

- Booking flow (high-level)
  - UI composition is under src/app/components/booking_page_components (e.g., InputForm.jsx, Calender.tsx, TimeSlots.tsx, AppointmentConfirmation.tsx).
  - InputForm.jsx builds a FormData payload and posts to summaryApi.bookAppointment (/patient-details). For “Other” concerns, requires at least one document file and a note per file. Date and slot come from context (selectedDate/selectedSlots).

- Admin dashboard
  - Components live under src/app/components/Admin_dashboard (e.g., SideBar.tsx, TodayAppointmentPage.jsx, CalenderSection.jsx, WhatsappMessageInbox.jsx, BillingInterface.jsx, PatientInformations.jsx).
  - SideBar.tsx handles responsive expansion/collapse and tab selection; parent components drive which content is active.

- User details
  - User profile views live under src/app/components/UserdetailsComponent and subfolders; editing invokes Axios to PATCH /user/:id via summaryApi.updateUserDetails.

- Auth and routing
  - summary.api.ts defines login/logout/verify token endpoints.
  - A sample middleware file exists at src/app/middlewares/RolebaseAuthorization.middleware.ts (protecting /dashboard/* in example). Note: Next.js middleware is only applied if placed at the project root as middleware.ts; this file under src/app/middlewares is not automatically executed by Next.js.

- Styling and fonts
  - Tailwind is configured via postcss.config.mjs; fonts are loaded via next/font in layout.tsx (Geist, Nunito, Outfit, Oswald).

- Linting and build config
  - ESLint uses next/core-web-vitals and next/typescript via a FlatConfig bridge (eslint.config.mjs).
  - next.config.ts: eslint.ignoreDuringBuilds=true, reactStrictMode=false, experimental.optimizeCss=false.

CI/CD notes
- GitLab CI (.gitlab-ci.yml)
  - Build stage: builds and pushes a Docker image using docker:dind to $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA.
  - Deploy stage: triggers a Render deploy via curl to https://api.render.com/deploy/$RENDER_SERVICE_ID?key=$RENDER_API_KEY.
  - Both stages are configured to run only on the sanjayan branch.

Important from README
- Development server: npm run dev, then open http://localhost:3000.
- The main editing entrypoint for the landing page is src/app/page.tsx; hot reload is enabled in dev.
