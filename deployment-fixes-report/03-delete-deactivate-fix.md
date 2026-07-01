# Room delete/deactivate fix

## Backend behavior

The project uses soft delete for rooms.

Endpoint:

```text
DELETE /api/rooms/:id
```

Rules:

- Requires authentication.
- Requires role `admin`.
- Looks up the room by `_id` and `companyId`.
- Does not permanently delete from MongoDB.
- Sets:

```ts
room.isActive = false;
```

## Backend fix

Before, the endpoint returned only:

```json
{ "message": "Room deleted." }
```

Now it returns the updated room:

```json
{
  "message": "Room deactivated.",
  "room": {
    "_id": "...",
    "isActive": false
  }
}
```

If the room is already inactive, the backend returns:

```json
{
  "message": "Room is already inactive.",
  "room": {
    "isActive": false
  }
}
```

## Frontend behavior

File:

```text
frontend/src/app/dashboard/rooms/page.tsx
```

Changes:

- The button label is now `Deactivate`.
- The button appears only for active rooms and admin users.
- After a successful API response, the room is updated immediately in React state.
- If the API does not return a room, the list is reloaded.
- Failures are shown in an error message.

## Expected result

1. Active room shows `Active` badge and `Deactivate` button.
2. User clicks `Deactivate`.
3. Confirmation appears.
4. Backend sets `isActive=false`.
5. Room card updates to `Inactive`.
6. `Deactivate` button disappears.
7. No frontend crash.

## Runtime verification performed

The seed owner account was not available locally, so a temporary account was created through `/api/auth/register`.

Temporary account used:

```text
deploy-test-1782937149@example.com
```

API test result:

```text
CreatedRoom: Deployment Test Room
CreatedActive: True
DeactivatedActive: False
DeactivateMessage: Room deactivated.
```

This confirms that create + deactivate works on the running backend.
