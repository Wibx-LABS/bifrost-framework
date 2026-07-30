/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) 2026 Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file notification-preferences.module.ts
 * @author @CodeGen via /bifrost:build
 * @date Thursday, July 30th 2026 04:30:00 pm
 * @description Lazy-loaded feature module for the Notification Preferences screen.
 *              Imports CommonlibModule WITHOUT forRoot() (manual §12) for the
 *              app-* wrappers and TranslateModule for the translate pipe.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonlibModule } from 'commonlib';

import { NotificationPreferencesRoutingModule } from './notification-preferences-routing.module';
import { NotificationPreferencesComponent } from './notification-preferences.component';

// Per TRAJECTORY §4 decision 4: lazy-loaded feature module at
//   containers/personal/notification-preferences/ (manual §12 lazy loading;
//   §5.1 puts logged-in self-service flows under containers/personal/).
//   Ruled out: eager module (bundle budget §2); containers/home/ (pre-auth area).
// ReactiveFormsModule is intentionally absent: the staged FormGroup is driven
//   programmatically (no formControlName on app-* wrappers per TRAJECTORY §4
//   decision 2), and FormBuilder is providedIn root.
@NgModule({
    declarations: [NotificationPreferencesComponent],
    imports: [
        CommonModule,
        TranslateModule,
        CommonlibModule,
        NotificationPreferencesRoutingModule
    ]
})
export class NotificationPreferencesModule
{
}
