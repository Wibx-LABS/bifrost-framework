/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.actions.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Action triads (load / save) for the notificationPreferences slice,
 *              following the `[Store Tag] Verb [Result]` convention (manual §7).
 */

import { createAction, props } from '@ngrx/store';
import { ErrorPayload } from 'commonlib';

import { storeTag } from './notification-preferences.store';
import { NotificationPreferences } from '../../services/models/notification-preferences.model';

export const loadPreferences = createAction(`${storeTag} Load the notification preferences`);
export const loadPreferencesSuccess = createAction(
    `${storeTag} Load the notification preferences success`,
    props<{ preferences: NotificationPreferences }>()
);
export const loadPreferencesError = createAction(
    `${storeTag} Load the notification preferences error`,
    props<{ error: ErrorPayload }>()
);

// Per TRAJECTORY §4 decision 3: save carries the complete staged { email, push, sms }
//   (full PUT, no PATCH, no per-toggle auto-save).
export const savePreferences = createAction(
    `${storeTag} Save the notification preferences`,
    props<{ preferences: NotificationPreferences }>()
);
export const savePreferencesSuccess = createAction(
    `${storeTag} Save the notification preferences success`,
    props<{ preferences: NotificationPreferences }>()
);
export const savePreferencesError = createAction(
    `${storeTag} Save the notification preferences error`,
    props<{ error: ErrorPayload }>()
);
