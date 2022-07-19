
import { INestApplication } from '@nestjs/common';
import { NestContainer } from '@nestjs/core/injector/container';
import { Module } from '@nestjs/core/injector/module';
import { scanModuleRoutes } from './scan-module-routes';
import { extractAppGlobalPrefix } from './extract-app-global-prefix';
import { extractModuleControllers } from './extract-module-controllers';
import {
    ControllerInspectionData,
    ApplicationInspectionData } from '../../models/app-scanner';


export function scanApplication(app: INestApplication): ApplicationInspectionData {
    const container: NestContainer = (app as any).container;
    const globalPrefix = extractAppGlobalPrefix(app);
    const modules: Module[] = [...container.getModules().values()];

    const collectiveRoutes = modules.map((module) => {
        const allRoutes = extractModuleControllers(module, container)
        // const { metatype } = module;
        // const path = metatype? reflectModulePath(metatype): '';
        return scanModuleRoutes(allRoutes);
    });

    const uniqueCollectiveRoutes = collectiveRoutes
        .reduce((uniqueMap, routeMap) =>
            Array
                .from(routeMap.entries())
                .reduce((map, [k, v]) => map.has(k) ? map : map.set(k, v), uniqueMap),
            new Map<string, ControllerInspectionData>()
        );

    return {
        routes: uniqueCollectiveRoutes,
        globalPrefix
    };

}