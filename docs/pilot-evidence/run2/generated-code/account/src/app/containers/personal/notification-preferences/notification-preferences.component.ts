/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.component.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Container for the Notification Preferences screen (account app).
 *              Dispatches the load on init, stages edits in a local FormGroup
 *              seeded from the store, and dispatches the full staged object on
 *              Save. OnPush; all store reads via async pipe; the one code-side
 *              subscription (form seeding) is takeUntil(destroy$)-guarded.
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import * as NotificationPreferencesActions from '../../../core/stores/notification-preferences/notification-preferences.actions';
import {
    selectHasLoadError,
    selectIsLoading,
    selectIsSaving,
    selectPreferences
} from '../../../core/stores/notification-preferences/notification-preferences.selectors';
import { NotificationPreferences } from '../../../core/services/models/notification-preferences.model';

type NotificationChannel = 'email' | 'push' | 'sms';

@Component({
    selector: 'app-notification-preferences',
    templateUrl: './notification-preferences.component.html',
    styleUrls: ['./notification-preferences.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPreferencesComponent implements OnInit, OnDestroy
{
    // Per TRAJECTORY §2 stack lock: reactive-forms style with staged local state —
    //   the FormGroup stages edits; nothing is persisted until an explicit Save
    //   (§4 decision 3: no auto-save on toggle flip).
    form: FormGroup = this._fb.nonNullable.group({
        email: false,
        push: false,
        sms: false
    });

    preferences$: Observable<NotificationPreferences | null> = this._store.select(selectPreferences);
    isLoading$: Observable<boolean> = this._store.select(selectIsLoading);
    isSaving$: Observable<boolean> = this._store.select(selectIsSaving);
    hasLoadError$: Observable<boolean> = this._store.select(selectHasLoadError);

    // Per TRAJECTORY §3 SHOULD-1: Save is disabled while a save is in flight and
    //   until the initial load succeeded (preferences === null before first load).
    isSaveDisabled$: Observable<boolean> = combineLatest([this.isSaving$, this.preferences$]).pipe(
        map(([isSaving, preferences]) => isSaving || preferences === null)
    );

    private _destroy$ = new Subject<void>();

    constructor(private _fb: FormBuilder, private _store: Store)
    {
    }

    ngOnInit(): void
    {
        this._store.dispatch(NotificationPreferencesActions.loadPreferences());

        // Seeds the staged form from server truth (initial load and post-save commit).
        // Per TRAJECTORY §5 prior-incidents: code-side subscription is
        //   takeUntil(destroy$)-guarded (GOTCHAS §Angular & RxJS). distinctUntilChanged
        //   keeps re-emissions of the same reference from clobbering staged edits, so
        //   staged values survive a save failure (§3 MUST-3).
        this._store
            .select(selectPreferences)
            .pipe(
                filter((preferences): preferences is NotificationPreferences => preferences !== null),
                distinctUntilChanged(),
                takeUntil(this._destroy$)
            )
            .subscribe((preferences) => this.form.patchValue(preferences));
    }

    ngOnDestroy(): void
    {
        this._destroy$.next();
        this._destroy$.complete();
    }

    /**
     * Stages a single channel flip. No dispatch happens here — persistence is
     * Save-only per TRAJECTORY §4 decision 3.
     */
    onChannelChange(channel: NotificationChannel, isEnabled: boolean): void
    {
        this.form.get(channel)?.setValue(isEnabled);
    }

    /**
     * Dispatches the complete staged { email, push, sms } object (full PUT).
     */
    onSave(): void
    {
        this._store.dispatch(NotificationPreferencesActions.savePreferences({ preferences: this.form.getRawValue() }));
    }

    /**
     * Re-dispatches the load after a load failure (TRAJECTORY §3 MAY-1 retry affordance).
     */
    onRetry(): void
    {
        this._store.dispatch(NotificationPreferencesActions.loadPreferences());
    }
}
