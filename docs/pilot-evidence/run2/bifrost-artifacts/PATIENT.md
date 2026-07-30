# Feature Scope (PATIENT.md)

**Feature:** Notification Preferences
**App:** account (Vizmos Nx monorepo — Angular)
**Owner:** Product
**Timeline:** Normal
**Destination:** Backend review (Gabriel) → merge

## What we want

A "Notification Preferences" screen in the **account** app where a logged-in user can turn 3 notification channels on/off:
- Email notifications
- Push notifications
- SMS notifications

## Behavior

- On open, load the user's current preferences from the API.
- Show 3 toggles reflecting current state.
- On save, persist the changes to the API.
- The whole screen must be translated in **pt / en / es** (all labels, toggle names, save button, success/error messages).
- Follow the existing Vizmos conventions (Angular/Nx/NgRx, naming, component library, i18n approach). This must arrive review-ready — Backend only reviews, does not rewrite.

## API (assume these exist per the knowledge layer)

- `GET /api/user/notification-preferences` → `{ email: boolean, push: boolean, sms: boolean }`
- `PUT /api/user/notification-preferences` body `{ email, push, sms }` → 200

## Done means

- Toggles load + reflect current prefs.
- Save persists and shows success/error feedback.
- Full pt/en/es i18n.
- Matches Vizmos conventions (naming, structure, component patterns).
