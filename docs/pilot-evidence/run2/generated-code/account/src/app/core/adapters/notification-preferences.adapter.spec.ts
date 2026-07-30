/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.adapter.spec.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Unit tests for NotificationPreferencesAdapter — full payload,
 *              partial payload normalized to false, empty payload (IMPACT §6
 *              partial/malformed API response edge case).
 */

import { NotificationPreferencesAdapter } from './notification-preferences.adapter';
import { NotificationPreferencesDto } from '../services/models/notification-preferences.dto';

describe('NotificationPreferencesAdapter', () =>
{
    let adapter: NotificationPreferencesAdapter;

    beforeEach(() =>
    {
        adapter = new NotificationPreferencesAdapter();
    });

    describe('adapt', () =>
    {
        it('should map a full payload one-to-one', () =>
        {
            const dto: NotificationPreferencesDto = { email: true, push: false, sms: true };

            expect(adapter.adapt(dto)).toEqual({ email: true, push: false, sms: true });
        });

        it('should normalize missing fields of a partial payload to false', () =>
        {
            const dto: NotificationPreferencesDto = { email: true };

            expect(adapter.adapt(dto)).toEqual({ email: true, push: false, sms: false });
        });

        it('should normalize an empty payload to all-false', () =>
        {
            expect(adapter.adapt({})).toEqual({ email: false, push: false, sms: false });
        });

        it('should normalize non-boolean truthy wire values to false', () =>
        {
            // The wire is untrusted (TRAJECTORY §2): anything that is not `true` is false.
            const dto = { email: 'yes', push: 1, sms: null } as unknown as NotificationPreferencesDto;

            expect(adapter.adapt(dto)).toEqual({ email: false, push: false, sms: false });
        });
    });

    describe('toDto', () =>
    {
        it('should mirror the full model into the PUT body', () =>
        {
            expect(adapter.toDto({ email: false, push: true, sms: false })).toEqual({ email: false, push: true, sms: false });
        });
    });
});
