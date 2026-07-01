# Environment and deployment guide

## Backend environment variables

File:

```text
backend/.env.example
```

Recommended backend variables:

```env
MONGODB_URI=mongodb://localhost:27017/surf-booking
JWT_SECRET=replace-with-a-long-random-secret
PORT=5005
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5005
```

For production:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-production-secret
PORT=5005
FRONTEND_URL=https://your-frontend.example.com
BACKEND_URL=https://your-backend.example.com
```

If multiple frontend origins are needed:

```env
FRONTEND_URL=https://frontend-one.example.com,https://frontend-two.example.com
```

## Frontend environment variables

File:

```text
frontend/.env.example
```

Local development can leave `NEXT_PUBLIC_API_URL` empty:

```env
NEXT_PUBLIC_API_URL=
BACKEND_URL=http://localhost:5005
```

Production example:

```env
NEXT_PUBLIC_API_URL=https://your-backend.example.com
BACKEND_URL=https://your-backend.example.com
```

`NEXT_PUBLIC_API_URL` can be either:

```text
https://your-backend.example.com
```

or:

```text
https://your-backend.example.com/api
```

The frontend normalizes both formats.

## API URL behavior

File:

```text
frontend/src/lib/api.ts
```

Local default:

```text
/api
```

Production:

```text
NEXT_PUBLIC_API_URL + /api
```

Authorization remains:

```http
Authorization: Bearer <token>
```

## Upload URL behavior

Backend upload response:

```json
{
  "url": "https://your-backend.example.com/uploads/image.jpg",
  "relativeUrl": "/uploads/image.jpg"
}
```

Frontend display:

- absolute URLs are used directly;
- `/uploads/...` paths are resolved through backend origin when configured;
- missing/broken images show a placeholder.

## Local start commands

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Local URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5005
Health:   http://localhost:5005/api/health
```

## Production build commands

Backend:

```bash
cd backend
npm run build
npm run start
```

Frontend:

```bash
cd frontend
npm run build
npm run start
```
