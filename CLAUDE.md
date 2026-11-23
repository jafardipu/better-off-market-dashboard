# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Admin dashboard for BetterOffMarket, an off-market real-estate platform. Admins review property listings, monitor offers and user-to-user conversations, chat with users directly, manage users, FAQs and legal content. It is a frontend only: all data comes from a separate REST + socket.io backend.

`README.md` is unmodified create-next-app boilerplate. Its port (3000) is wrong, and the `"yumquick"` package name is left over from a template.

## Commands

The project uses pnpm (`pnpm-lock.yaml`, `node_modules/.pnpm`). `package-lock.json` is stale, so don't use npm to install.

```bash
pnpm install
pnpm dev           # next dev on http://localhost:3005
pnpm build
pnpm start         # serves the production build on port 3005
pnpm lint          # next lint; currently passes with warnings only
npx tsc --noEmit   # typecheck (no script for it); currently passes clean
```

There is no test framework or test suite.

ESLint deliberately turns off `no-explicit-any`, `no-unused-vars`, `ban-ts-comment` and `ban-types` (`.eslintrc.json`), and `any` is used freely, especially for API response data.

## Environment

Env vars are read only through `envConfig` in `src/config/index.ts`:

- `NEXT_PUBLIC_BASE_URL`: REST API base URL
- `NEXT_PUBLIC_SOCKET_URL`: socket.io server
- `NEXT_PUBLIC_GOOGLE_MAP_KEY`: listing location map
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`: FCM web push

Remote images used with `next/image` must have their host listed in `images.domains` in `next.config.mjs`. Uploaded files are served from DigitalOcean Spaces.

## Architecture

Next.js 14 App Router. Almost every page is a client component.

### Routing and auth

- `src/app/(auth)/` contains login, forgot-password, verify-otp and reset-password. `src/app/(adminDashboard)/` contains everything else, inside an antd `Layout` with a sidebar and header. `/` redirects to `/dashboard`.
- `src/middleware.ts` guards every route by checking for the `betteroffmarket-dashboard-access-token` cookie. A new public route must be added to `src/lib/authRoutes.ts`, or the middleware will redirect it to `/login`.
- The token lives in two places that must stay in sync:
  - the Redux `auth` slice, persisted to localStorage by redux-persist;
  - that cookie.
  `setUser` and `logout` in `src/redux/features/authSlice.ts` write both. Always go through those actions rather than setting either one directly.
- Sidebar items are defined in `src/utils/navLinks.tsx`. The active item is stored in localStorage (`activeNav`) when clicked, not derived from the URL.

### Data layer (RTK Query)

- There is a single `baseApi` (`src/redux/api/baseApi.ts`). Each domain file in `src/redux/api/` calls `baseApi.injectEndpoints(...)` and exports the generated hooks.
- `baseQuery` sends `Authorization: Bearer <token>`. During the OTP, forgot-password and reset-password flows it also sends a `token` header, read from sessionStorage keys (`token`, `forgotPasswordToken`, `resetPasswordToken`, `signUpToken`).
- On a 401, it calls `POST /auth/refresh-token` (cookie-based), stores the new access token and retries the request. If the refresh fails, it logs the user out.
- Cache invalidation uses tags from `src/redux/tagTypes.ts`. A new tag must be added to both the `tagTypes` object and the `tagTypesList` array.
- List responses have the shape `{ data, meta }` (`IApiResponse` in `src/types/api-response.ts`). Components read `data?.data`.
- To show an API error to the user, use `errorModification(error)` (`src/lib/errors/errorModification.ts`) to get a readable message, then pass it to a sonner `toast`.

### List and table pattern

Pagination and filter state lives in URL search params, not in component state:

- Tables read `page` and `limit` with `useSearchParams()`, debounce search input with `use-debounce`, and pass the result as `params` to the RTK query hook.
- `src/utils/DataTable.tsx` wraps the antd `Table` and writes page changes back to the URL through `useUpdateSearchParams` (`src/hooks/useUpdateSearchParams.tsx`).

### Realtime and notifications

Providers are nested in `src/lib/Provider/Provider.tsx` in this order: Redux, then PersistGate, then `SocketProvider`, then `FirebaseProvider`.

- `useSocket()` (`src/context/SocketContextApi.tsx`) returns a socket.io connection authenticated with the auth token. It connects only once a token exists.
- The two messaging routes are different features:
  - `/user-messages` is the admin's own direct chat with users. It is fully socket-driven (`my_chat_list`, `message_page`, `send_message`, `seen`, `typing`, `onlineUser`) and lives in `user-messages/_components/MessagesPage.tsx`.
  - `/messages` (labelled "Conversations" in the sidebar) is read-only monitoring of chats between two users (`partyA`/`partyB`). It uses REST through `chatApi`.
- Firebase Cloud Messaging uses the service worker `public/firebase-messaging-sw.js`. In the foreground, `FirebaseProvider` invalidates the `Notifications` tag and shows a `CustomToast`.

### UI

- Ant Design is the main component library (layout, tables, modals, forms, menus). Its theme is in `src/theme/antTheme.ts`, and the admin layout applies some component-level overrides.
- shadcn/ui components (new-york style, `components.json`) live in `src/components/ui/` and are used alongside antd.
- Brand colors are CSS variables in `src/app/globals.css` (`--color-main`, `--color-text-color`, ...). Tailwind exposes them as `main-color`, `text-color`, `section-bg`, `primary-gray`, and so on. `globals.css` also contains many `!important` overrides of antd styles.
- Toasts use `sonner` (the `<Toaster>` is mounted in the root layout).
- Placement of components:
  - Components used by one route go in a `_components/` folder next to its `page.tsx`.
  - Dashboard components used by several routes go in `src/components/(adminDashboard)/`.
  - Generic components go in `src/components/shared/`.

## Gotchas

- **`offers/` and `orders/` are near-duplicate route trees.**
  - The sidebar links to `/offers` (the list).
  - Its table rows link to `/orders/[order-id]`, so `orders/[order-id]` is the live offer detail page.
  - `offers/[order-id]` is an older, unreachable copy without the null-safety fixes.
  - Make detail-page changes in `orders/[order-id]`. Make list changes in `offers/_components`, and mirror them into `orders/_components` if that list is still used.
- `messages/[id]/_components` and `user-messages/_components` contain separately maintained copies of the chat components (`ChatHeader`, `MessageBubble`, `AttachmentGrid`, `Chatfileutils`, ...). Edit the copy that belongs to the feature you are changing.
- `src/lib/utils.ts` and `src/lib/utils.tsx` both define `cn()`. TypeScript and webpack can resolve `@/lib/utils` to different files, so keep the two identical.
