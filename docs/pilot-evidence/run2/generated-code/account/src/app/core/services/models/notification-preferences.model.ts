/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.model.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description App-side model for the user's notification preferences (account app).
 *              The 3 boolean channels are always concrete booleans here — never
 *              undefined — because NotificationPreferencesAdapter normalizes the
 *              wire shape before it reaches this type (TRAJECTORY §4 decision 5).
 */

/**
 * The 3 notification channels a logged-in user can turn on/off.
 * camelCase app shape; the wire shape lives in notification-preferences.dto.ts.
 */
export interface NotificationPreferences
{
    email: boolean;
    push: boolean;
    sms: boolean;
}
