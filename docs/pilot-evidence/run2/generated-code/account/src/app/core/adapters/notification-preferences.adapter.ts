/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.adapter.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description DTO <-> model bridge for notification preferences. Isolates the
 *              unverified wire shape in one file and guarantees the templates
 *              never receive undefined.
 */

import { Injectable } from '@angular/core';

import { NotificationPreferencesDto } from '../services/models/notification-preferences.dto';
import { NotificationPreferences } from '../services/models/notification-preferences.model';

// Per TRAJECTORY §4 decision 5: wire shape isolated behind a DTO + adapter with
//   explicit boolean normalization (missing/undefined field -> false).
//   Rationale: endpoints are assumed-not-verified (§2), so a Backend-confirmed
//   mismatch stays confined to this file; templates never receive undefined.
//   Ruled out: binding the raw response into the store.
@Injectable({ providedIn: 'root' })
export class NotificationPreferencesAdapter
{
    /**
     * Translates the wire DTO into the app model, normalizing every channel
     * to a concrete boolean. A missing or non-true field becomes false.
     */
    adapt(dto: NotificationPreferencesDto): NotificationPreferences
    {
        return {
            email: dto?.email === true,
            push: dto?.push === true,
            sms: dto?.sms === true
        };
    }

    /**
     * Translates the app model into the full PUT body. The model is already
     * fully concrete, so this is a straight mirror of the 3 channels.
     */
    toDto(model: NotificationPreferences): NotificationPreferencesDto
    {
        return {
            email: model.email,
            push: model.push,
            sms: model.sms
        };
    }
}
