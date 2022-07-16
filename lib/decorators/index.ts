import 'reflect-metadata';
import { EndpointMeta } from '../core/helpers/endpoint-meta';
import { SDK_ENDPOINT_META } from '../constants';
import { HttpPayloadType } from '../models/app-scanner/http-payload-type';

const apiPayloadDecoratorGenerator = (type: HttpPayloadType) =>
    (opt: { name: string }): ParameterDecorator =>
        function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
            const existedEpMeta = Reflect.getMetadata(SDK_ENDPOINT_META, target, propertyKey);
            const paramTypes: Array<any> = Reflect.getMetadata('design:paramtypes', target.constructor.prototype, propertyKey)
            const epMeta: EndpointMeta = existedEpMeta ? existedEpMeta : new EndpointMeta(propertyKey);
            epMeta.args.add({ name: opt.name, type, index: parameterIndex, paramType: paramTypes?.[parameterIndex] });
            Reflect.defineMetadata(SDK_ENDPOINT_META, epMeta, target, propertyKey);
        }

export const ApiBody = apiPayloadDecoratorGenerator(HttpPayloadType.BODY);
export const ApiParam = apiPayloadDecoratorGenerator(HttpPayloadType.PARAMS);
export const ApiQuery = apiPayloadDecoratorGenerator(HttpPayloadType.QUERY);
export const ApiHeader = apiPayloadDecoratorGenerator(HttpPayloadType.HEADERS);


export const Endpoint = (): MethodDecorator => function (target: Object, propertyKey: string | symbol) {
    const existedEpMeta = Reflect.getMetadata(SDK_ENDPOINT_META, target, propertyKey);
    const epMeta: EndpointMeta = existedEpMeta ? existedEpMeta : new EndpointMeta(propertyKey);
    epMeta.endpointDecorated = true;
    Reflect.defineMetadata(SDK_ENDPOINT_META, epMeta, target, propertyKey);
}
