/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences-routing.module.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Child routing for the lazy Notification Preferences module.
 */

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { NotificationPreferencesComponent } from './notification-preferences.component';

const routes: Array<Route> = [
    { path: '', component: NotificationPreferencesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationPreferencesRoutingModule
{
}
