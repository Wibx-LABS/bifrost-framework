/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.effects.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Load/save orchestration for the notificationPreferences slice.
 *              Load uses switchMap; save uses exhaustMap (spam-click guard).
 *              Every error path routes through ErrorHandlingService; the success
 *              snackbar fires only after the PUT completes.
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { ErrorHandlingService, SnackBarService } from 'commonlib';

import { NotificationPreferencesApiService } from '../api/notification-preferences.api';
import { NotificationPreferencesAdapter } from '../adapters/notification-preferences.adapter';
import * as NotificationPreferencesActions from '../stores/notification-preferences/notification-preferences.actions';

@Injectable()
export class NotificationPreferencesEffects
{
    loadPreferences$ = createEffect(() =>
        this._actions$.pipe(
            ofType(NotificationPreferencesActions.loadPreferences),
            // switchMap: a re-entered screen or retry cancels the stale in-flight load.
            switchMap(() =>
                this._api.getPreferences().pipe(
                    map((dto) => NotificationPreferencesActions.loadPreferencesSuccess({ preferences: this._adapter.adapt(dto) })),
                    // Per TRAJECTORY §5 prior-incidents: no uncaught HTTP errors bypassing
                    //   ErrorHandlingService (GOTCHAS §HTTP). catchError stays inside the
                    //   inner pipe so the effect survives for the session.
                    catchError((error) =>
                    {
                        this._errorHandling.handle(error);
                        return of(NotificationPreferencesActions.loadPreferencesError({ error: this._errorHandling.toPayload(error) }));
                    })
                )
            )
        )
    );

    savePreferences$ = createEffect(() =>
        this._actions$.pipe(
            ofType(NotificationPreferencesActions.savePreferences),
            // Per TRAJECTORY §3 SHOULD-1: exhaustMap ignores re-dispatches while a save
            //   is in flight (spam-click guard, IMPACT §6).
            exhaustMap(({ preferences }) =>
                this._api.putPreferences(this._adapter.toDto(preferences)).pipe(
                    map(() => NotificationPreferencesActions.savePreferencesSuccess({ preferences })),
                    // Per TRAJECTORY §5 prior-incidents: store update !== backend success —
                    //   the success feedback fires here, after the PUT resolved, never on
                    //   dispatch (GOTCHAS §State-vs-DB).
                    // [CONFIRMAR-NO-SOURCE] SnackBarService success API: documented only as
                    //   "Toast notification helper" (manual §6.1.2); method name/signature to
                    //   confirm in libs/commonlib source at handoff (PLAN Open question 5).
                    tap(() => this._snackBar.success('notification-preferences.feedback.save-success')),
                    catchError((error) =>
                    {
                        this._errorHandling.handle(error);
                        return of(NotificationPreferencesActions.savePreferencesError({ error: this._errorHandling.toPayload(error) }));
                    })
                )
            )
        )
    );

    // Per TRAJECTORY §2 security boundaries: session handling (405 -> auto-logout,
    //   timeouts) stays with the existing SessionInterceptor — no parallel logic here.
    constructor(
        private _actions$: Actions,
        private _api: NotificationPreferencesApiService,
        private _adapter: NotificationPreferencesAdapter,
        private _errorHandling: ErrorHandlingService,
        private _snackBar: SnackBarService
    )
    {
    }
}
