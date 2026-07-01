# Subscription/payment UI blocker removed

## Problem

The dashboard layout rendered a red banner:

```text
Subscription expired. New bookings are paused until you renew.
```

It also showed a `Renew Now` button.

This was outside the requested module scope:

```text
Authentication + simple Rooms CRUD
```

## Files changed

```text
frontend/src/app/dashboard/layout.tsx
frontend/src/app/register/page.tsx
```

## What was removed from dashboard layout

Removed:

- subscription API import;
- subscription status state;
- subscription status check;
- red expired/canceled subscription banner;
- `Renew Now` button;
- sidebar `Subscription` link.

## Register redirect fix

Before:

```ts
router.push("/dashboard/subscription");
```

After:

```ts
router.push("/dashboard");
```

## Expected behavior

- Dashboard opens normally.
- Rooms page opens normally.
- No subscription expired banner appears.
- No payment/subscription prompt appears during the module demo.
- Rooms CRUD is not blocked by subscription status.

## Note

Subscription pages and backend routes may still exist in the larger project, but they are no longer shown as blockers in the dashboard flow for this module.
