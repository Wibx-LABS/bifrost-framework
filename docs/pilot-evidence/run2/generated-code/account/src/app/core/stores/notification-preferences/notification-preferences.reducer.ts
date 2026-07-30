/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.reducer.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Pure reducer for the notificationPreferences slice. Immutable
 *              updates only; all orchestration lives in the effects class.
 */

import { createReducer, on } from '@ngrx/store';

import * as NotificationPreferencesActions from './notification-preferences.actions';
import { initialNotificationPreferencesStore } from './notification-preferences.store';

// Per TRAJECTORY §5 prior-incidents: no state mutation in reducers; no logic in
//   reducers instead of effects (GOTCHAS §NgRx). Every handler returns a new
//   object via spread.
export const notificationPreferencesReducer = createReducer(
    initialNotificationPreferencesStore,

    on(NotificationPreferencesActions.loadPreferences, (state) => ({
        ...state,
        isLoading: true,
        hasLoadError: false
    })),

    on(NotificationPreferencesActions.loadPreferencesSuccess, (state, { preferences }) => ({
        ...state,
        isLoading: false,
        preferences
    })),

    on(NotificationPreferencesActions.loadPreferencesError, (state) => ({
        ...state,
        isLoading: false,
        hasLoadError: true
    })),

    on(NotificationPreferencesActions.savePreferences, (state) => ({
        ...state,
        isSaving: true
    })),

    on(NotificationPreferencesActions.savePreferencesSuccess, (state, { preferences }) => ({
        ...state,
        isSaving: false,
        preferences
    })),

    on(NotificationPreferencesActions.savePreferencesError, (state) => ({
        ...state,
        isSaving: false
    }))
);
