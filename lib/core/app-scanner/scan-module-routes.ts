import { RequestMethod, Type } from "@nestjs/common";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { ControllerInspectionData, ControllerRoutesHttpPayloadArg, ControllerRoutesInspectionData } from "../../models/app-scanner";
import { HttpPayloadType } from "../../models/app-scanner/http-payload-type";


import { reflectControllerPath, reflectMethodRoute, reflectRequestEndpointMeta, reflectRequestMethod } from "../helpers/reflect-data";

/**
 * 
 * @param ctrlClass controller class
 * @param method controller class method
 * @returns {Array<ControllerRoutesHttpPayloadArg>} list of the controller-method's parameters metadata - payload-http-type & model-class. 
 */
 function extractControllerRequestHandlersHttpPayload(
    ctrlClass: any,
    method: Function,
): Array<ControllerRoutesHttpPayloadArg> {
    const requestEndpointMeta = reflectRequestEndpointMeta(ctrlClass, method.name);
    if (requestEndpointMeta == undefined) { // if undefined the method is not a request handler
        return [];
    }
    const endpointMetaPayloadList  = Array.from(requestEndpointMeta.args.values()).sort((a, b) => a.index - b.index)

    return endpointMetaPayloadList.map((arg, i) => ({
        httpPayloadType: arg.type,
        argumentIndex: arg.index,
        model: arg.paramType,
        name: arg.name
    }));
}

/**
 * 
 * @param method controller class method
 * @returns controller-method's http-method-type & relative path from parent controller.
 */
function extractControllerRequestHandlers /* paths & methods*/(
    method: Function,
): { method: string, path: string } {
    const routePath = reflectMethodRoute(method);
    if (routePath == undefined) { // if undefined the method is not a request handler
        return undefined;
    }
    const requestMethod = reflectRequestMethod(method)

    // const fullPath = routePath; //this.validateRoutePath(routePath);
    return {
        method: RequestMethod[requestMethod].toLowerCase(),
        path: routePath === '' ? '/' : routePath,
    };
}

/**
 * 
 * @param controllersWrapperMap 
 */
 export function scanModuleRoutes(controllersWrapperMap: Map<string, InstanceWrapper>) {
    const controllersMetadataMap = new Map<string, ControllerInspectionData>();
    for (let ctrl of (controllersWrapperMap.values())) {
        const { instance, metatype } = ctrl;
        const prototype = Object.getPrototypeOf(instance);
        const classMethodNameList = Object.getOwnPropertyNames(prototype);
        const ctrlPath = reflectControllerPath(metatype as Type<any>)
        const controllerRoutes = classMethodNameList
            .filter(classMethodName => classMethodName != 'constructor')
            .map<ControllerRoutesInspectionData>(classMethodName => {
                const classMethod = prototype[classMethodName];
                const endpointMeta = reflectRequestEndpointMeta(metatype, classMethod.name);
                const reqHandlerMetadata = extractControllerRequestHandlers(classMethod);
                const httpPayloadArgs = extractControllerRequestHandlersHttpPayload(metatype, classMethod)
                if (reqHandlerMetadata) {
                    const { method: httpMethod, path } = reqHandlerMetadata;
                    return { 
                        httpMethod, path, reqMethodName: classMethodName, 
                        reqMethodRef: classMethod, httpPayloadArgs, 
                        additionalMetadata: endpointMeta
                    }; 
                }
            })
            .filter(md => md != undefined);

        controllersMetadataMap.set(ctrl.name, {
            controllerTypeRef: metatype,
            controllerInstanceRef: instance,
            controllerPath: ctrlPath,
            controllerRoutes
        });
    }

    return controllersMetadataMap;
}
