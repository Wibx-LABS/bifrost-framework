/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.api.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Typed HTTP wrapper for GET/PUT /api/user/notification-preferences.
 *              Thin per-domain api service (manual §2 core/api convention): URL from
 *              the central `api` constant, DTO in/out, no error UX here — error
 *              handling lives in NotificationPreferencesEffects via
 *              ErrorHandlingService. Auth/session headers and the default 35s
 *              timeout come from the existing interceptors (TRAJECTORY §2 security
 *              boundaries: no parallel auth/session logic).
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api } from 'commonlib';

import { NotificationPreferencesDto } from '../services/models/notification-preferences.dto';

// Per TRAJECTORY §2 blocking dependency: both endpoints are assumed-existing per
//   PATIENT; Backend (Gabriel) confirms existence + the exact factory entry name
//   at handoff. [CONFIRMAR-NO-SOURCE] api.user.notificationPreferences() — if the
//   account app already has a user-domain core/api service, fold these two methods
//   into it additively instead of keeping this parallel class (PLAN Task 2 lookup rule).
@Injectable({ providedIn: 'root' })
export class NotificationPreferencesApiService
{
    constructor(private _http: HttpClient)
    {
    }

    /**
     * Loads the user's current notification preferences.
     * @returns the raw wire DTO; callers normalize via NotificationPreferencesAdapter.
     */
    getPreferences(): Observable<NotificationPreferencesDto>
    {
        return this._http.get<NotificationPreferencesDto>(api.user.notificationPreferences());
    }

    /**
     * Persists the full preferences object (full PUT per TRAJECTORY §4 decision 3 —
     * no PATCH, no per-toggle auto-save).
     * @param dto the complete { email, push, sms } wire body.
     */
    putPreferences(dto: NotificationPreferencesDto): Observable<void>
    {
        return this._http.put<void>(api.user.notificationPreferences(), dto);
    }
}
