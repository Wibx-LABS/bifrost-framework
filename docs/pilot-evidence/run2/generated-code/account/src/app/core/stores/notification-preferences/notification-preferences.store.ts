/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.store.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Store interface + storeTag + initial state for the
 *              notificationPreferences slice (four-file pattern, manual §7).
 */

import { NotificationPreferences } from '../../services/models/notification-preferences.model';

// Per TRAJECTORY §4 decision 1: preferences state lives in a new NgRx slice
//   `notificationPreferences` (four-file pattern + effects), not in local component
//   state. Rationale: the account app's convention is one slice per feature flow
//   (editAccount, changePassword, accountVerification — manual §5.1).
//   Ruled out: local component state + direct service call; adding fields to `profile`.
export const storeTag: string = '[Notification Preferences Store]';

export interface NotificationPreferencesStore
{
    preferences: NotificationPreferences | null;
    isLoading: boolean;
    isSaving: boolean;
    hasLoadError: boolean;
}

export const initialNotificationPreferencesStore: NotificationPreferencesStore = {
    preferences: null,
    isLoading: false,
    isSaving: false,
    hasLoadError: false
};
