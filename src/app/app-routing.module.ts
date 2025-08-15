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
    Routes,
    ROUTES,
    UrlMatcher,
    UrlMatchResult,
    UrlSegment,
    UrlSegmentGroup,
} from '@angular/router';
import { Observable } from 'rxjs';

type ModuleRoutes = Routes | ((injector: Injector) => Routes | Observable<Routes>);

const modulesRoutes: WeakMap<InjectionToken<unknown>, ModuleRoutes> = new WeakMap();

export const APP_ROUTES = new InjectionToken<Routes>('APP_ROUTES');

/**
 * Build app routes.
 *
 * @param injector Module injector.
 * @returns App routes.
 */
function buildAppRoutes(injector: Injector): Routes {
    return injector.get<Routes[]>(APP_ROUTES, []).flat();
}

@NgModule({
    imports: [
        RouterModule.forRoot([]),

        // Register Jibu route here
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

    /**
     * Register child routes at the root of the app.
     *
     * @param routes Routes to add.
     * @returns ModuleWithProviders.
     */
    static forChild(routes: Routes): ModuleWithProviders<AppRoutingModule> {
        return {
            ngModule: AppRoutingModule,
            providers: [
                { provide: APP_ROUTES, multi: true, useValue: routes },
            ],
        };
    }

}
