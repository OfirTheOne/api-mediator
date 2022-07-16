import { Type } from '@nestjs/common';
import { NestContainer } from '@nestjs/core/injector/container';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';

/**
 * 
 * @param module 
 * @param containerRef 
 */
 export function extractModuleControllers(module: Module, containerRef: NestContainer): Map<string, InstanceWrapper<object>> {
    const { routes, metatype, relatedModules } = module;
    let allRoutes = new Map(routes);

    // only load submodules routes if asked
    const isGlobal = (module: Type<any>) => !containerRef.isGlobalModule(module);

    Array.from(relatedModules.values())
        .filter(isGlobal as any)
        .map(({ routes: relatedModuleRoutes }) => relatedModuleRoutes)
        .forEach((relatedModuleRoutes) => {
            allRoutes = new Map([...allRoutes, ...relatedModuleRoutes]);
        });

    return allRoutes;
}
