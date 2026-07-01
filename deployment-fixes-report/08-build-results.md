# Build and verification results

## Backend build

Command:

```bash
cd backend
npm run build
```

Result:

```text
PASS
```

Output summary:

```text
surf-booking-backend@1.0.0 build
tsc
```

## Frontend build

Command:

```bash
cd frontend
npm run build
```

Result:

```text
PASS
```

Output summary:

```text
Compiled successfully
Linting and checking validity of types
Generating static pages (25/25)
```

## Frontend lint

Initial command:

```bash
cd frontend
npm run lint
```

Initial result:

```text
FAILED
```

Reason:

```text
No ESLint config and missing/incompatible ESLint packages.
```

Fixes applied:

```text
frontend/.eslintrc.json
eslint@8.57.0
eslint-config-next@14.2.35
```

Final command:

```bash
cd frontend
npm run lint
```

Final result:

```text
PASS
```

Output:

```text
No ESLint warnings or errors
```

## Runtime API verification

### Health check

Endpoint:

```text
GET http://localhost:5005/api/health
```

Previously verified while server was running:

```json
{
  "status": "ok",
  "message": "Surf Booking API is running!"
}
```

### Create and deactivate room

The seed owner account was missing locally, so a temporary account was created through the real register endpoint:

```text
deploy-test-1782937149@example.com
```

Verification result:

```text
CreatedRoom: Deployment Test Room
CreatedActive: True
DeactivatedActive: False
DeactivateMessage: Room deactivated.
```

### Upload image

Uploaded file:

```text
frontend/public/hero.jpg
```

Verification result:

```text
UploadedUrl: http://localhost:5005/uploads/image-1782938647225-238498405.jpg
RelativeUrl: /uploads/image-1782938647225-238498405.jpg
ImageStatus: 200
```

## Dependency note

Installing lint tooling updated:

```text
frontend/package.json
frontend/package-lock.json
```

`npm install` reported vulnerabilities from the dependency tree:

```text
6 vulnerabilities (1 moderate, 5 high)
```

I did not run `npm audit fix --force` because that can introduce breaking dependency upgrades outside the requested minimal deployment fixes.
