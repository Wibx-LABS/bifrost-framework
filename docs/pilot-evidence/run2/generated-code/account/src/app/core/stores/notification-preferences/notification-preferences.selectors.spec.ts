/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.selectors.spec.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Unit tests for the notificationPreferences selectors (projector level).
 */

import {
    selectHasLoadError,
    selectIsLoading,
    selectIsSaving,
    selectPreferences
} from './notification-preferences.selectors';
import { NotificationPreferencesStore } from './notification-preferences.store';

describe('notificationPreferences selectors', () =>
{
    const state: NotificationPreferencesStore = {
        preferences: { email: true, push: false, sms: true },
        isLoading: true,
        isSaving: false,
        hasLoadError: true
    };

    it('should select the preferences', () =>
    {
        expect(selectPreferences.projector(state)).toEqual({ email: true, push: false, sms: true });
    });

    it('should select the loading flag', () =>
    {
        expect(selectIsLoading.projector(state)).toBe(true);
    });

    it('should select the saving flag', () =>
    {
        expect(selectIsSaving.projector(state)).toBe(false);
    });

    it('should select the load-error flag', () =>
    {
        expect(selectHasLoadError.projector(state)).toBe(true);
    });
});
