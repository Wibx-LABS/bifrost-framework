/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.reducer.spec.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Unit tests for notificationPreferencesReducer — one case per on()
 *              handler plus an immutability guard.
 */

import * as NotificationPreferencesActions from './notification-preferences.actions';
import { notificationPreferencesReducer } from './notification-preferences.reducer';
import { initialNotificationPreferencesStore, NotificationPreferencesStore } from './notification-preferences.store';
import { NotificationPreferences } from '../../services/models/notification-preferences.model';

describe('notificationPreferencesReducer', () =>
{
    const preferences: NotificationPreferences = { email: true, push: false, sms: true };
    const error = { message: 'timeout' } as never;

    it('should flag loading and clear a previous load error on loadPreferences', () =>
    {
        const previous: NotificationPreferencesStore = { ...initialNotificationPreferencesStore, hasLoadError: true };

        const state = notificationPreferencesReducer(previous, NotificationPreferencesActions.loadPreferences());

        expect(state.isLoading).toBe(true);
        expect(state.hasLoadError).toBe(false);
    });

    it('should store the preferences and stop loading on loadPreferencesSuccess', () =>
    {
        const loading: NotificationPreferencesStore = { ...initialNotificationPreferencesStore, isLoading: true };

        const state = notificationPreferencesReducer(loading, NotificationPreferencesActions.loadPreferencesSuccess({ preferences }));

        expect(state.isLoading).toBe(false);
        expect(state.preferences).toEqual(preferences);
    });

    it('should flag the load error and stop loading on loadPreferencesError', () =>
    {
        const loading: NotificationPreferencesStore = { ...initialNotificationPreferencesStore, isLoading: true };

        const state = notificationPreferencesReducer(loading, NotificationPreferencesActions.loadPreferencesError({ error }));

        expect(state.isLoading).toBe(false);
        expect(state.hasLoadError).toBe(true);
        expect(state.preferences).toBeNull();
    });

    it('should flag saving on savePreferences without touching the stored preferences', () =>
    {
        const loaded: NotificationPreferencesStore = { ...initialNotificationPreferencesStore, preferences };

        const staged: NotificationPreferences = { email: false, push: false, sms: false };
        const state = notificationPreferencesReducer(loaded, NotificationPreferencesActions.savePreferences({ preferences: staged }));

        expect(state.isSaving).toBe(true);
        expect(state.preferences).toEqual(preferences);
    });

    it('should commit the saved preferences and stop saving on savePreferencesSuccess', () =>
    {
        const saving: NotificationPreferencesStore = { ...initialNotificationPreferencesStore, preferences, isSaving: true };
        const saved: NotificationPreferences = { email: false, push: true, sms: false };

        const state = notificationPreferencesReducer(saving, NotificationPreferencesActions.savePreferencesSuccess({ preferences: saved }));

        expect(state.isSaving).toBe(false);
        expect(state.preferences).toEqual(saved);
    });

    it('should keep the last server truth and stop saving on savePreferencesError', () =>
    {
        // Per TRAJECTORY §3 MUST-3: staged values live in the component; the store
        // keeps the last confirmed server truth so the user can retry.
        const saving: NotificationPreferencesStore = { ...initialNotificationPreferencesStore, preferences, isSaving: true };

        const state = notificationPreferencesReducer(saving, NotificationPreferencesActions.savePreferencesError({ error }));

        expect(state.isSaving).toBe(false);
        expect(state.preferences).toEqual(preferences);
    });

    it('should never mutate the previous state', () =>
    {
        const previous: NotificationPreferencesStore = Object.freeze({ ...initialNotificationPreferencesStore });

        const state = notificationPreferencesReducer(previous, NotificationPreferencesActions.loadPreferences());

        expect(state).not.toBe(previous);
        expect(previous).toEqual(initialNotificationPreferencesStore);
    });
});
