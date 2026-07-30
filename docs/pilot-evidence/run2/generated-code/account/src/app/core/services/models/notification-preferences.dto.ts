/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.dto.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Wire shape of GET/PUT /api/user/notification-preferences.
 *              Fields are optional on purpose: the endpoints are assumed-existing
 *              but unverified (TRAJECTORY §2 blocking dependency), so the DTO
 *              mirrors an untrusted wire and the adapter normalizes every field
 *              to a concrete boolean (TRAJECTORY §4 decision 5).
 */

/**
 * DTO for /api/user/notification-preferences (both GET response and PUT body).
 * All field names are single words, so the snake_case-vs-camelCase seam is
 * not visible here — the adapter still owns the translation.
 */
export interface NotificationPreferencesDto
{
    email?: boolean;
    push?: boolean;
    sms?: boolean;
}
