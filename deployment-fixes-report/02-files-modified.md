# Files modified

## Backend

### `backend/.env.example`

Added deployment-oriented variables:

- `FRONTEND_URL` can support configured frontend origins.
- `BACKEND_URL` documents the public backend URL used for uploaded image URLs.

### `backend/src/server.ts`

Changes:

- Added comma-separated `FRONTEND_URL` support for CORS.
- Changed static uploads serving to `app.use("/uploads", express.static(...))`.
- Changed fallback port to `5005` to match the frontend local proxy.

### `backend/src/routes/upload.ts`

Changes:

- Upload responses now include:
  - `url`: public backend URL + `/uploads/...`
  - `relativeUrl`: `/uploads/...`
- Uses `BACKEND_URL` when configured.
- Falls back to the request host in local development.

### `backend/src/routes/rooms.ts`

Changes:

- DELETE now performs soft delete only.
- If room is already inactive, returns the room without crashing.
- Response now includes the updated room object:

```json
{
  "message": "Room deactivated.",
  "room": { "isActive": false }
}
```

## Frontend

### `frontend/.env.example`

Added frontend deployment variables:

- `NEXT_PUBLIC_API_URL`
- `BACKEND_URL`

### `frontend/.eslintrc.json`

Added noninteractive Next.js ESLint config.

### `frontend/package.json`

Added lint dependencies:

- `eslint`
- `eslint-config-next`

### `frontend/package-lock.json`

Updated automatically by `npm install`.

### `frontend/next.config.js`

Changes:

- Uses `BACKEND_URL` or `NEXT_PUBLIC_API_URL` instead of hardcoded localhost.
- Rewrites `/api/*` to backend `/api/*`.
- Rewrites `/uploads/*` to backend `/uploads/*`.

### `frontend/src/lib/api.ts`

Changes:

- Added `NEXT_PUBLIC_API_URL` support.
- Added `getApiUrl()`.
- Added `resolveAssetUrl()` for uploaded images.
- Auth token behavior remains unchanged: Bearer token is still attached.

### `frontend/src/components/ImageUpload.tsx`

Changes:

- Upload now uses `getApiUrl("/upload")`.
- Returned image URLs are normalized with `resolveAssetUrl()`.
- Upload errors now show the backend error message when available.
- Styling aligned with the SurfBook cream/blue theme.

### `frontend/src/app/dashboard/layout.tsx`

Changes:

- Removed subscription status API check.
- Removed expired subscription banner.
- Removed `Renew Now` button.
- Removed subscription link from sidebar.
- Dashboard remains protected by auth.

### `frontend/src/app/register/page.tsx`

Change:

- Redirect after registration changed from `/dashboard/subscription` to `/dashboard`.

### `frontend/src/app/dashboard/rooms/page.tsx`

Changes:

- Room deactivation now updates local state immediately.
- Active rooms show `Deactivate`.
- Inactive rooms keep `Inactive` badge.
- Inactive rooms do not show the deactivate button.
- Delete/deactivate errors are displayed in the page.
- Room images use `resolveAssetUrl()`.
- Missing or broken images show a clean placeholder instead of a broken icon.
