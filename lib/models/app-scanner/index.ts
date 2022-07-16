import { EndpointMeta } from "lib/core/helpers/endpoint-meta";
import { Type } from "../utils";
import { HttpPayloadType } from "./http-payload-type";

export interface ControllerRoutesHttpPayloadArg {
    httpPayloadType: HttpPayloadType;
    argumentIndex: number;
    model: any;
    name: string
}

export interface ControllerRoutesInspectionData {
    httpMethod: string,
    path: string,
    reqMethodName: string,
    reqMethodRef: Function
    httpPayloadArgs?: Array<ControllerRoutesHttpPayloadArg>
    additionalMetadata: EndpointMeta
}

export interface ControllerInspectionData {
    controllerTypeRef: Function | Type<any>,
    controllerInstanceRef: any,
    controllerPath: string,
    controllerRoutes: Array<ControllerRoutesInspectionData>
}

export interface ApplicationInspectionData {
    routes: Map<string, ControllerInspectionData>;
    globalPrefix: string,
    onlyDecoratedEndpoint?: boolean;
}

