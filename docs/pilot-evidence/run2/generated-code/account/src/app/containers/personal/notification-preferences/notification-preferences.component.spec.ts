/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.component.spec.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Component tests for the Notification Preferences screen.
 *              Per bifrost-code-review §4.3.1 (rendered-binding rule, pilot run-1
 *              guard): NO_ERRORS_SCHEMA is forbidden here — CommonlibModule is
 *              imported for real so the app-checkbox / app-button bindings resolve,
 *              state is asserted through the rendered children, and gestures are
 *              simulated on the DOM via DebugElement.triggerEventHandler.
 */

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommonlibModule } from 'commonlib';

import { NotificationPreferencesComponent } from './notification-preferences.component';
import * as NotificationPreferencesActions from '../../../core/stores/notification-preferences/notification-preferences.actions';
import {
    selectHasLoadError,
    selectIsLoading,
    selectIsSaving,
    selectPreferences
} from '../../../core/stores/notification-preferences/notification-preferences.selectors';
import { NotificationPreferences } from '../../../core/services/models/notification-preferences.model';

describe('NotificationPreferencesComponent', () =>
{
    const loaded: NotificationPreferences = { email: true, push: false, sms: true };

    let fixture: ComponentFixture<NotificationPreferencesComponent>;
    let store: MockStore;
    let dispatchSpy: jest.SpyInstance;

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({
            declarations: [NotificationPreferencesComponent],
            imports: [CommonlibModule, TranslateModule.forRoot()],
            providers: [
                provideMockStore({
                    selectors: [
                        { selector: selectPreferences, value: null },
                        { selector: selectIsLoading, value: false },
                        { selector: selectIsSaving, value: false },
                        { selector: selectHasLoadError, value: false }
                    ]
                })
            ]
        }).compileComponents();

        store = TestBed.inject(MockStore);
        dispatchSpy = jest.spyOn(store, 'dispatch');
        fixture = TestBed.createComponent(NotificationPreferencesComponent);
    });

    function checkbox(index: number): DebugElement
    {
        return fixture.debugElement.queryAll(By.css('app-checkbox'))[index];
    }

    function saveButton(): DebugElement
    {
        return fixture.debugElement.query(By.css('app-button.save-action'));
    }

    function emitLoaded(preferences: NotificationPreferences): void
    {
        store.overrideSelector(selectPreferences, preferences);
        store.refreshState();
        fixture.detectChanges();
    }

    it('should dispatch loadPreferences on init', () =>
    {
        fixture.detectChanges();

        expect(dispatchSpy).toHaveBeenCalledWith(NotificationPreferencesActions.loadPreferences());
    });

    it('should render the values returned by the API on the three checkboxes', () =>
    {
        fixture.detectChanges();
        emitLoaded(loaded);

        expect(checkbox(0).componentInstance.checked).toBe(true);
        expect(checkbox(1).componentInstance.checked).toBe(false);
        expect(checkbox(2).componentInstance.checked).toBe(true);
    });

    it('should show the skeleton while loading instead of unbound controls', () =>
    {
        store.overrideSelector(selectIsLoading, true);
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('app-skeleton-loading'))).toBeTruthy();
        expect(fixture.debugElement.queryAll(By.css('app-checkbox')).length).toBe(0);
    });

    it('should stage a checkbox flip without dispatching a save', () =>
    {
        fixture.detectChanges();
        emitLoaded(loaded);
        dispatchSpy.mockClear();

        checkbox(1).triggerEventHandler('checkedChange', true);
        fixture.detectChanges();

        expect(checkbox(1).componentInstance.checked).toBe(true);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch the full staged object on Save click', () =>
    {
        fixture.detectChanges();
        emitLoaded(loaded);
        checkbox(1).triggerEventHandler('checkedChange', true);
        fixture.detectChanges();
        dispatchSpy.mockClear();

        saveButton().triggerEventHandler('click', null);

        expect(dispatchSpy).toHaveBeenCalledWith(NotificationPreferencesActions.savePreferences({
            preferences: { email: true, push: true, sms: true }
        }));
    });

    it('should disable Save before the initial load succeeds', () =>
    {
        // preferences stays null: the loaded block is hidden, so no Save is reachable at all.
        fixture.detectChanges();

        expect(saveButton()).toBeNull();
    });

    it('should disable Save while a save is in flight', () =>
    {
        fixture.detectChanges();
        emitLoaded(loaded);
        store.overrideSelector(selectIsSaving, true);
        store.refreshState();
        fixture.detectChanges();

        expect(saveButton().componentInstance.disabled).toBe(true);
    });

    it('should preserve staged values when a save fails', () =>
    {
        fixture.detectChanges();
        emitLoaded(loaded);
        checkbox(1).triggerEventHandler('checkedChange', true);
        fixture.detectChanges();

        // Save failure: isSaving toggles true -> false; the store keeps server truth.
        store.overrideSelector(selectIsSaving, true);
        store.refreshState();
        fixture.detectChanges();
        store.overrideSelector(selectIsSaving, false);
        store.refreshState();
        fixture.detectChanges();

        expect(checkbox(1).componentInstance.checked).toBe(true);
    });

    it('should show the error state with a retry that re-dispatches the load', () =>
    {
        store.overrideSelector(selectHasLoadError, true);
        fixture.detectChanges();
        dispatchSpy.mockClear();

        const retryButton = fixture.debugElement.query(By.css('.load-error app-button'));
        expect(fixture.debugElement.query(By.css('app-status-pill'))).toBeTruthy();

        retryButton.triggerEventHandler('click', null);

        expect(dispatchSpy).toHaveBeenCalledWith(NotificationPreferencesActions.loadPreferences());
    });
});
