/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.effects.spec.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Unit tests for NotificationPreferencesEffects — load maps through the
 *              adapter, both error paths route through ErrorHandlingService, the
 *              success snackbar fires only after the PUT completes, and rapid save
 *              dispatches are swallowed by exhaustMap (marble test).
 */

import { Actions } from '@ngrx/effects';
import { Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { NotificationPreferencesEffects } from './notification-preferences.effects';
import { NotificationPreferencesAdapter } from '../adapters/notification-preferences.adapter';
import * as NotificationPreferencesActions from '../stores/notification-preferences/notification-preferences.actions';
import { NotificationPreferences } from '../services/models/notification-preferences.model';

describe('NotificationPreferencesEffects', () =>
{
    const preferences: NotificationPreferences = { email: true, push: false, sms: true };
    const errorPayload = { message: 'timeout' };

    let apiMock: { getPreferences: jest.Mock; putPreferences: jest.Mock };
    let errorHandlingMock: { handle: jest.Mock; toPayload: jest.Mock };
    let snackBarMock: { success: jest.Mock };

    beforeEach(() =>
    {
        apiMock = { getPreferences: jest.fn(), putPreferences: jest.fn() };
        errorHandlingMock = { handle: jest.fn(), toPayload: jest.fn().mockReturnValue(errorPayload) };
        snackBarMock = { success: jest.fn() };
    });

    function createEffects(actions$: Observable<unknown>): NotificationPreferencesEffects
    {
        return new NotificationPreferencesEffects(
            new Actions(actions$ as Observable<never>),
            apiMock as never,
            new NotificationPreferencesAdapter(),
            errorHandlingMock as never,
            snackBarMock as never
        );
    }

    describe('loadPreferences$', () =>
    {
        it('should map the DTO through the adapter on load success', () =>
        {
            // Partial wire payload: adapter normalizes the missing channels to false.
            // of()/throwError() emit synchronously, so these specs subscribe and assert
            // inline — no done callbacks (bifrost-code-review §4.3), and firstValueFrom
            // is unavailable on the locked RxJS ~6.6.0 (TRAJECTORY §2 stack lock).
            apiMock.getPreferences.mockReturnValue(of({ email: true }));

            const effects = createEffects(of(NotificationPreferencesActions.loadPreferences()));
            let emitted: unknown;

            effects.loadPreferences$.subscribe((action) => emitted = action);

            expect(emitted).toEqual(NotificationPreferencesActions.loadPreferencesSuccess({
                preferences: { email: true, push: false, sms: false }
            }));
        });

        it('should route a load failure through ErrorHandlingService and dispatch the error action', () =>
        {
            const httpError = new Error('504');
            apiMock.getPreferences.mockReturnValue(throwError(httpError));

            const effects = createEffects(of(NotificationPreferencesActions.loadPreferences()));
            let emitted: unknown;

            effects.loadPreferences$.subscribe((action) => emitted = action);

            expect(errorHandlingMock.handle).toHaveBeenCalledWith(httpError);
            expect(emitted).toEqual(NotificationPreferencesActions.loadPreferencesError({ error: errorPayload as never }));
        });
    });

    describe('savePreferences$', () =>
    {
        it('should PUT the full staged object and emit the success snackbar only after 200', () =>
        {
            apiMock.putPreferences.mockReturnValue(of(undefined));

            const effects = createEffects(of(NotificationPreferencesActions.savePreferences({ preferences })));
            let emitted: unknown;

            effects.savePreferences$.subscribe((action) => emitted = action);

            expect(apiMock.putPreferences).toHaveBeenCalledWith({ email: true, push: false, sms: true });
            expect(snackBarMock.success).toHaveBeenCalledWith('notification-preferences.feedback.save-success');
            expect(emitted).toEqual(NotificationPreferencesActions.savePreferencesSuccess({ preferences }));
        });

        it('should route a save failure through ErrorHandlingService without any snackbar', () =>
        {
            const httpError = new Error('500');
            apiMock.putPreferences.mockReturnValue(throwError(httpError));

            const effects = createEffects(of(NotificationPreferencesActions.savePreferences({ preferences })));
            let emitted: unknown;

            effects.savePreferences$.subscribe((action) => emitted = action);

            expect(errorHandlingMock.handle).toHaveBeenCalledWith(httpError);
            expect(snackBarMock.success).not.toHaveBeenCalled();
            expect(emitted).toEqual(NotificationPreferencesActions.savePreferencesError({ error: errorPayload as never }));
        });

        it('should swallow rapid re-dispatches while a save is in flight (exhaustMap)', () =>
        {
            const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

            scheduler.run(({ hot, cold, expectObservable }) =>
            {
                const save = NotificationPreferencesActions.savePreferences({ preferences });
                const success = NotificationPreferencesActions.savePreferencesSuccess({ preferences });

                // Second dispatch at frame 1 lands while the 5-frame PUT is in flight.
                apiMock.putPreferences.mockReturnValue(cold('-----(r|)', { r: undefined }));

                const effects = createEffects(hot('ab', { a: save, b: save }));

                expectObservable(effects.savePreferences$).toBe('-----s', { s: success });
            });

            // Asserted after the scheduler flushed: the second dispatch never reached the API.
            expect(apiMock.putPreferences).toHaveBeenCalledTimes(1);
        });
    });
});
