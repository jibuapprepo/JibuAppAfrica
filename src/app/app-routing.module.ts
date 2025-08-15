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

function buildAppRoutes(injector: Injector): Routes {
    return injector.get<Routes[]>(APP_ROUTES, []).flat();
}

function buildConditionalUrlMatcher(pathOrMatcher: string | UrlMatcher, condition: () => boolean): UrlMatcher {
    return (segments: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route): UrlMatchResult | null => {
        if (!condition()) {
            return null;
        }

        if (typeof pathOrMatcher === 'function') {
            return pathOrMatcher(segments, segmentGroup, route);
        }

        const path = pathOrMatcher;
        const parts = path.split('/');
        const isFullMatch = route.pathMatch === 'full';
        const posParams: Record<string, UrlSegment> = {};

        if (path === '') {
            return (!isFullMatch || segments.length === 0) ? { consumed: [] } : null;
        }
        if (parts.length > segments.length) {
            return null;
        }
        if (isFullMatch && (segmentGroup.hasChildren() || parts.length < segments.length)) {
            return null;
        }

        for (let index = 0; index < parts.length; index++) {
            const part = parts[index];
            const segment = segments[index];
            const isParameter = part.startsWith(':');

            if (isParameter) {
                posParams[part.substring(1)] = segment;
            } else if (part !== segment.path) {
                return null;
            }
        }

        return { consumed: segments.slice(0, parts.length), posParams };
    };
}

export type LazyRoutesModule = Type<any> |
    Routes |
    Observable<Type<any> | Routes | DefaultExport<Type<any>> | DefaultExport<Routes>> |
    Promise<Type<any> | Routes | DefaultExport<Type<any>> | DefaultExport<Routes>>;

export type LazyDefaultStandaloneComponent = Promise<DefaultExport<Type<unknown>>>;

export function buildRegExpUrlMatcher(regexp: RegExp): UrlMatcher {
    return (segments: UrlSegment[]): UrlMatchResult | null => {
        if (segments.length === 0) {
            return null;
        }

        const path = segments.map(segment => segment.path).join('/');
        const match = regexp.exec(path)?.[0];

        if (!match || !path.startsWith(match)) {
            return null;
        }

        const [consumedSegments, consumedPath] = segments.slice(1).reduce(
            ([segments, path], segment) =>
                path === match
                    ? [segments, path]
                    : [segments.concat(segment), `${path}/${segment.path}`],
            [[segments[0]] as UrlSegment[], segments[0].path]
        );

        if (consumedPath !== match) {
            return null;
        }

        return { consumed: consumedSegments };
    };
}

export type ModuleRoutes = { children: Routes; siblings: Routes };
export type ModuleRoutesConfig = Routes | Partial<ModuleRoutes>;

export function conditionalRoutes(routes: Routes, condition: () => boolean): Routes {
    return routes.map(route => {
        const { path, matcher, ...newRoute } = route;
        const matcherOrPath = matcher ?? path;

        if (matcherOrPath === undefined) {
            throw new Error('Route defined without matcher nor path');
        }

        return {
            ...newRoute,
            matcher: buildConditionalUrlMatcher(matcherOrPath, condition),
        };
    });
}

export function isEmptyRoute(route: Route): boolean {
    return !('component' in route)
        && !('loadComponent' in route)
        && !('children' in route)
        && !('loadChildren' in route)
        && !('redirectTo' in route);
}

export function resolveModuleRoutes(injector: Injector, token: InjectionToken<ModuleRoutesConfig[]>): ModuleRoutes {
    if (modulesRoutes.has(token)) {
        return modulesRoutes.get(token) as ModuleRoutes;
    }

    const configs = injector.get(token, []);
    const routes = configs.map(config => {
        if (Array.isArray(config)) {
            return {
                children: [],
                siblings: config,
            };
        }

        return {
            children: config.children || [],
            siblings: config.siblings || [],
        };
    });

    const moduleRoutes = {
        children: routes.map(r => r.children).flat(),
        siblings: routes.map(r => r.siblings).flat(),
    };

    modulesRoutes.set(token, moduleRoutes);

    return moduleRoutes;
}

export const APP_ROUTES = new InjectionToken('APP_ROUTES');

/**
 * Custom Jibu feature route.
 * Make sure src/core/features/jibu/jibu.module.ts exists
 * and exports JibuPageModule.
 */
export const JIBU_ROUTES: Routes = [
{
  path: 'jibu',
  loadChildren: () => import('../core/features/jibu/jibu.module').then(m => m.JibuPageModule)
},
];

@NgModule({
    imports: [
        RouterModule.forRoot([]),
    ],
    providers: [
        // Custom Jibu route first
        { provide: ROUTES, multi: true, useValue: JIBU_ROUTES },

        // Moodle default routes after
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
