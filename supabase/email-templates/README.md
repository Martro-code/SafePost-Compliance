# Supabase Auth Email Templates

These HTML files are **reference copies** of the email templates configured in the Supabase Dashboard. They are **not** deployed automatically via the Supabase CLI or CI/CD pipeline.

## How to update

1. Edit the template file in this directory.
2. Copy the updated HTML into the Supabase Dashboard:
   **Authentication > Email Templates** (project ref: `acvcwzaipsxyrwbxithc`).
3. Commit the change here so the repository stays in sync with the Dashboard.

## Templates

| File | Dashboard Section | Purpose |
|------|-------------------|---------|
| `confirm-signup.html` | Confirm signup | Email verification for new accounts |
| `change-email.html` | Change email address | Verification when a user changes their email |
| `invite-user.html` | Invite user | Team member invitation emails |
| `magic-link.html` | Magic link | Passwordless sign-in links |
| `reauthentication.html` | Reauthentication | Verification code for sensitive actions |

## Template variables

- `{{ .ConfirmationURL }}` — Used in all templates except reauthentication.
- `{{ .Token }}` — Used in the reauthentication template for the verification code.
