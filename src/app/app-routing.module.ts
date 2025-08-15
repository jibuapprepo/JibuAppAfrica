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

import { InjectionToken, Injector, ModuleWithProviders, NgModule, Type } from '@angular/core';
import {
    RouterModule,
    Route,
    Routes,
    ROUTES,
    UrlMatcher,
    UrlMatchResult,
    UrlSegment,
    UrlSegmentGroup,
    DefaultExport,
} from '@angular/router';
import { Observable } from 'rxjs';

const modulesRoutes: WeakMap<InjectionToken<unknown>, ModuleRoutes> = new WeakMap();

/**
 * Build app routes.
 *
 * @param injector Module injector.
 * @returns App routes.
 */
function buildAppRoutes(injector: Injector): Routes {
    return injector.get<Routes[]>(APP_ROUTES, []).flat();
}

// ... [keep all helper functions unchanged here] ...

export const APP_ROUTES = new InjectionToken('APP_ROUTES');

/**
 * Module used to register routes at the root of the application.
 */
@NgModule({
    imports: [
        RouterModule.forRoot([]),
        // 👇 Register the Jibu route here
        AppRoutingModule.forChild([
            {
                path: 'jibu',
                loadChildren: () =>
                    import('src/core/features/jibu/jibu.module').then(m => m.JibuPageModule),
            },
        ]),
    ],
    providers: [
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
