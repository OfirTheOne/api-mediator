
import { RequestMethod, Type } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { SDK_ENDPOINT_META } from '../../constants';
import { EndpointMeta } from './endpoint-meta';


export function reflectControllerPath(metatype: Type<unknown>): string {
    return Reflect.getMetadata(PATH_METADATA, metatype);
}

export function reflectMethodRoute(method: Function): string {
    return Reflect.getMetadata(PATH_METADATA, method);
}

export function reflectRequestMethod(method: Function): RequestMethod {
    return Reflect.getMetadata(METHOD_METADATA, method);
}

export function reflectRequestEndpointMeta(metatype: Function | Type<unknown>, method: string): EndpointMeta {
    return Reflect.getMetadata(SDK_ENDPOINT_META, metatype.prototype, method);
}
