# Form Migration Summary

## Schemas Added
- Invite request schema (`InviteForm.js`) validates `name`, `email`, and optional `note`.
- Invitation verification schema (`RequestInvite.tsx`) normalises and validates the invite `code`.
- Contact schema (`Contact.tsx`) validates requester details and message content.

## Files Updated
- `frontend/src/components/InviteForm.js`
- `frontend/src/pages/RequestInvite.tsx`
- `frontend/src/pages/Contact.tsx`
- `frontend/package.json` (added React Hook Form, Zod, and resolver dependencies)

## API Routes Touched
- `POST /api/v1/invite-requests` (invite request submission with idempotency key)
- `POST /api/invites/redeem` (invite verification with idempotency key)
- `POST /api/contact` (new contact submission endpoint with idempotency key)

## Manual Test Checklist
1. **Invite Request Form**
   - Submit empty form to confirm inline validation messages.
   - Submit valid data and verify success toast + cleared fields.
   - Trigger API error (e.g., disable network) to confirm alert message.
2. **Invite Verification Form**
   - Submit blank code to see validation error.
   - Submit valid code and confirm invite details + toast.
   - Force API error and ensure alert captures server message/field errors.
3. **Contact Form**
   - Validate each required field and ensure inline feedback.
   - Submit successful request and observe toast & reset.
   - Simulate server error to confirm alert messaging.
