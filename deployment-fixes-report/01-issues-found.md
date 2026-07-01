# Issues found during deployment preparation

## 1. Room deactivation did not update the UI correctly

The backend was already using a soft-delete approach by setting `Room.isActive = false`, but the DELETE endpoint returned only a success message. The frontend then refreshed the list, but the UI still showed a generic `Delete` action and did not clearly match the module wording: deactivation.

Impact:

- The user could not clearly see that the room became inactive.
- Inactive rooms could still show the delete button.
- The action looked like a hard delete, while the backend actually kept the room in the database.

## 2. Room image URLs were not deployment-ready

The upload/display flow had several fragile points:

- The frontend upload component depended on a local proxy path only.
- Uploaded images could be stored as relative `/uploads/...` paths.
- Production deployments need a public backend URL for uploaded assets.
- There was no clean placeholder when an image URL was missing or broken.

Impact:

- Room cards could show a broken image icon.
- Uploaded images might work locally but fail after deployment.

## 3. Subscription/payment UI blocker appeared in the dashboard

The dashboard layout checked subscription status and rendered a red expired-subscription banner with a `Renew Now` button.

Impact:

- The dashboard and rooms page could show payment/subscription prompts.
- This was outside the user's module scope.
- It could block or distract from the authentication + simple rooms CRUD demo.

## 4. Register redirected to subscription page

After registration, the frontend redirected the new user to `/dashboard/subscription`.

Impact:

- A new account was pushed into subscription/payment UI immediately.
- This contradicted the requested scope for deployment/demo.

## 5. API URLs were too local-development-oriented

The frontend API client used only `/api`, and Next rewrites used a fixed localhost backend. This works locally but is not enough for production unless deployment variables are available.

Impact:

- Deployed frontend/backend URLs could fail without code changes.
- Uploaded images needed a reliable backend origin.

## 6. Frontend lint script could not run

The project had `npm run lint`, but no ESLint config and no compatible ESLint dependencies.

Initial lint failures:

- First run opened Next.js interactive ESLint setup.
- After adding config, ESLint was missing.
- Installing latest ESLint installed v9, incompatible with this Next.js 14 lint command.

Final fix:

- Added `.eslintrc.json`.
- Installed compatible `eslint@8.57.0`.
- Installed `eslint-config-next@14.2.35`.

## 7. Seed owner account was not present in the local database

The expected seed login `owner@balisurfcamp.com / owner123` failed in the current local database.

Action taken:

- Created a temporary account through the real register endpoint for runtime API verification.
