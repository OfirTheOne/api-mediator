import { HttpPayloadType } from "../app-scanner/http-payload-type";

export interface RoutePayload {
    name: string;
    type: HttpPayloadType;
    schemeName: string;
}

export interface RouteEndpoint {
    name: string;
    path: string;
    method: string;
    payload: RoutePayload[];
}

export interface RouteComponent {
    name: string;
    path: string;
    endpoints: RouteEndpoint[];
}

export interface AppRouteing {
    globalPrefix: string;
    routes: Array<RouteComponent>;
}

