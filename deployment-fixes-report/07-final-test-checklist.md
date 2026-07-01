# Final manual test checklist

Use this checklist before deployment or demo.

## Authentication

- [ ] Open `/register`.
- [ ] Register a new account.
- [ ] Confirm the app redirects to `/dashboard`, not `/dashboard/subscription`.
- [ ] Logout.
- [ ] Open `/login`.
- [ ] Login with the new account.
- [ ] Confirm dashboard opens.
- [ ] Remove token or logout.
- [ ] Open `/dashboard/rooms` while logged out.
- [ ] Confirm redirect to `/login`.

## Dashboard without subscription blocker

- [ ] Open `/dashboard`.
- [ ] Confirm no red subscription expired banner appears.
- [ ] Confirm no `Renew Now` button appears.
- [ ] Confirm sidebar does not show `Subscription`.

## Rooms CRUD

- [ ] Open `/dashboard/rooms`.
- [ ] Confirm no subscription banner appears.
- [ ] Click `+ Add Room`.
- [ ] Try to create with missing required fields.
- [ ] Confirm validation error appears before/without relying only on backend.
- [ ] Add room without image.
- [ ] Confirm a clean `No room image` placeholder appears.
- [ ] Add or edit room with image.
- [ ] Confirm image upload succeeds.
- [ ] Confirm image appears in room card.
- [ ] Edit room name/capacity/price.
- [ ] Confirm changes appear in the list.
- [ ] Click `Deactivate` on an active room.
- [ ] Confirm browser confirmation appears.
- [ ] Confirm room status changes to `Inactive`.
- [ ] Confirm `Deactivate` button disappears for inactive room.
- [ ] Refresh the page.
- [ ] Confirm inactive status persists.

## Backend API checks

- [ ] `GET /api/health` returns status `ok`.
- [ ] `POST /api/auth/login` returns token for valid credentials.
- [ ] `GET /api/auth/me` works with Bearer token.
- [ ] `GET /api/rooms` works with Bearer token.
- [ ] `GET /api/rooms` fails without Bearer token.
- [ ] `DELETE /api/rooms/:id` fails without token.
- [ ] `DELETE /api/rooms/:id` fails for non-admin roles.
- [ ] `DELETE /api/rooms/:id` returns updated room with `isActive=false` for admin.

## Build checks

- [ ] Backend build:

```bash
cd backend
npm run build
```

- [ ] Frontend lint:

```bash
cd frontend
npm run lint
```

- [ ] Frontend build:

```bash
cd frontend
npm run build
```
