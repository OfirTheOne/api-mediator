import "reflect-metadata";
import { SDK_API_CLASS_META } from "../../constants";

interface ApiClassDecoratorOptions {
    name?: string;
    description?: string;
    body?: any; 
    params?: any; 
    query?: any; 
    response?: any;
}

interface ExtendedApiClassDecoratorOptions extends ApiClassDecoratorOptions {
    propertyKey?: string
}

function ApiClass(options: ExtendedApiClassDecoratorOptions): ClassDecorator {
    return function (target: Function) {
        return defineApiClassDecoratorMetadata(options, target);
    };
}

function defineApiClassDecoratorMetadata(options: ExtendedApiClassDecoratorOptions, target: Function): void {
    if (!Reflect.hasMetadata(SDK_API_CLASS_META, target)) {
        Reflect.defineMetadata(SDK_API_CLASS_META, target, options);
    }
}
