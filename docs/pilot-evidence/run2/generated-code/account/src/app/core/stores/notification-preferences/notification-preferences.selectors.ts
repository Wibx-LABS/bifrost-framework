/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.selectors.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Memoized selectors for the notificationPreferences slice.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NotificationPreferencesStore } from './notification-preferences.store';

export const selectNotificationPreferencesState =
    createFeatureSelector<NotificationPreferencesStore>('notificationPreferences');

export const selectPreferences = createSelector(selectNotificationPreferencesState, (state) => state.preferences);
export const selectIsLoading = createSelector(selectNotificationPreferencesState, (state) => state.isLoading);
export const selectIsSaving = createSelector(selectNotificationPreferencesState, (state) => state.isSaving);
export const selectHasLoadError = createSelector(selectNotificationPreferencesState, (state) => state.hasLoadError);
