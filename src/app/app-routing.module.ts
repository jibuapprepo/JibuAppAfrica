// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes, ROUTES } from '@angular/router';
import { buildAppRoutes } from './build-app-routes'; // keep your helper function if exists

export const APP_ROUTES = new InjectionToken<Routes>('APP_ROUTES');

/**
 * Custom Jibu feature route using standalone component.
 * No more JibuPageModule, we directly load the standalone JibuPage.
 */
export const JIBU_ROUTES: Routes = [
  {
    path: 'jibu',
    loadComponent: () =>
      import('../core/features/jibu/jibu').then(m => m.JibuPage)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot([]),
  ],
  providers: [
    // Register Jibu standalone route first
    { provide: ROUTES, multi: true, useValue: JIBU_ROUTES },

    // Register any default Moodle/app routes after
    { provide: ROUTES, multi: true, useFactory: buildAppRoutes, deps: [Injector] },
  ],
})
export class AppRoutingModule {
  static forChild(routes: Routes): ModuleWithProviders<AppRoutingModule> {
    return {
      ngModule: AppRoutingModule,
      providers: [
        { provide: APP_ROUTES, multi: true, useValue: routes },
      ],
    };
  }
}
