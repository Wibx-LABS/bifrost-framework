/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.api.spec.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Unit tests for NotificationPreferencesApiService — URL comes from
 *              the central `api` factory, correct verbs, PUT carries the full body.
 */

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { api } from 'commonlib';

import { NotificationPreferencesApiService } from './notification-preferences.api';
import { NotificationPreferencesDto } from '../services/models/notification-preferences.dto';

describe('NotificationPreferencesApiService', () =>
{
    let service: NotificationPreferencesApiService;
    let httpMock: HttpTestingController;

    beforeEach(() =>
    {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        service = TestBed.inject(NotificationPreferencesApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() =>
    {
        httpMock.verify();
    });

    it('should GET the preferences from the central api factory URL', () =>
    {
        const dto: NotificationPreferencesDto = { email: true, push: false, sms: true };
        let received: NotificationPreferencesDto | undefined;

        service.getPreferences().subscribe((response) => received = response);

        const request = httpMock.expectOne(api.user.notificationPreferences());
        expect(request.request.method).toBe('GET');

        request.flush(dto);
        expect(received).toEqual(dto);
    });

    it('should PUT the full preferences body to the central api factory URL', () =>
    {
        const dto: NotificationPreferencesDto = { email: false, push: true, sms: false };
        let completed = false;

        service.putPreferences(dto).subscribe({ complete: () => completed = true });

        const request = httpMock.expectOne(api.user.notificationPreferences());
        expect(request.request.method).toBe('PUT');
        expect(request.request.body).toEqual({ email: false, push: true, sms: false });

        request.flush(null);
        expect(completed).toBe(true);
    });
});
