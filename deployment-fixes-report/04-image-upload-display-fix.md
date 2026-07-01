# Room image upload and display fix

## Problem

Room images could show as broken images because URLs were not consistently resolved between:

- local frontend;
- local backend;
- production frontend;
- production backend;
- relative `/uploads/...` paths;
- absolute backend URLs.

## Backend upload route

File:

```text
backend/src/routes/upload.ts
```

The upload route now returns both:

```json
{
  "url": "http://localhost:5005/uploads/image-xxx.jpg",
  "relativeUrl": "/uploads/image-xxx.jpg"
}
```

In production, `url` uses:

```env
BACKEND_URL=https://your-backend.example.com
```

## Static file serving

File:

```text
backend/src/server.ts
```

Uploaded files are served publicly through:

```ts
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
```

## Frontend upload

File:

```text
frontend/src/components/ImageUpload.tsx
```

The upload URL now uses:

```ts
getApiUrl("/upload")
```

This means:

- local dev can use `/api/upload`;
- production can use `NEXT_PUBLIC_API_URL`;
- Authorization Bearer token is still sent.

## Frontend image display

File:

```text
frontend/src/app/dashboard/rooms/page.tsx
```

The room card now uses:

```ts
resolveAssetUrl(room.images?.[0])
```

If there is no image, or the image fails to load, the UI shows:

```text
No room image
```

instead of a broken icon.

## Next.js rewrites

File:

```text
frontend/next.config.js
```

Added rewrites:

```js
/api/*     -> backend /api/*
/uploads/* -> backend /uploads/*
```

This helps old relative uploaded image paths still work locally and in deployments that use the Next.js server.

## Runtime verification performed

Uploaded `frontend/public/hero.jpg` through the backend upload endpoint.

Result:

```text
UploadedUrl: http://localhost:5005/uploads/image-1782938647225-238498405.jpg
RelativeUrl: /uploads/image-1782938647225-238498405.jpg
ImageStatus: 200
```

This confirms:

- upload route works;
- returned URL is public;
- uploaded image loads successfully.
