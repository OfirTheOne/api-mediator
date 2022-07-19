import { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import { resolvePathsToUrl } from "../../../core/helpers/resolve-paths-to-url";
import { HttpPayloadType } from "../../../models/app-scanner/http-payload-type";
import { RouteEndpoint, RoutePayload } from "../../../models/app-routing";
import { HttpClientType } from "../../../models/http-client";
import { HttpClientAdapter } from "./http-client-adapter";


export class AxiosAdapter implements HttpClientAdapter {
    readonly type: HttpClientType.AXIOS = HttpClientType.AXIOS;
    readonly client: AxiosInstance;
    protected _baseUrl: string;

    constructor(client: AxiosInstance) {
        this.client = client;
    }

    set baseUrl(_baseUrl: string) {
        this.client.defaults.baseURL = _baseUrl;
        this._baseUrl = _baseUrl;
    }
    get baseUrl(): string {
        return this._baseUrl;
    }

    request<T>(presidingPath: string, re: RouteEndpoint, args: any[]): Promise<T> {
        return this.client.request(this.buildConfig(presidingPath, re, args));
    }

    protected buildConfig(presidingPath: string, re: RouteEndpoint, payloadValues: Record<string, string | number>[]): AxiosRequestConfig {
        const resolvedUrl = resolvePathsToUrl(presidingPath, re.path);
        const reqConfig: AxiosRequestConfig = { method: <Method>re.method, url: resolvedUrl };
        const routePayloadMap = orderRoutePayloadByExpectedType(re, payloadValues);
        const payloadWithValue = Array.from(routePayloadMap.entries())
        for (let [type, payload] of payloadWithValue) {
            switch (type) {
                case HttpPayloadType.PARAMS:
                    reqConfig.url = Array.from(Object.entries(payload.value))
                        .reduce((url, [k, v]) => applyUrlParam(url, k, v), resolvedUrl);
                    break;
                case HttpPayloadType.QUERY:
                    reqConfig.params = payload.value;
                    break;
                case HttpPayloadType.BODY:
                    reqConfig.data = payload.value;
                    break;
                case HttpPayloadType.HEADERS:
                    reqConfig.headers = payload.value;
                    break;
                default:
                    break;
            }
        }
        return reqConfig;
    }
}


function applyUrlParam(url: string, name: string, value: string | number): string {
    return url.replace(`:${name}`, `${value}`)
}

function orderRoutePayloadByExpectedType(re: RouteEndpoint, payloads: Record<string, string|number>[]) {
    return new Map<
        HttpPayloadType, 
        { routePayload: RoutePayload, value: Record<string, string|number> }
    >(Object.values(HttpPayloadType)
        .map(type => (<[string, RoutePayload]>[type, re.payload.find(p => p.type === type)]))
        .filter(([_, p]) => !!p)
        .map(([_, p], i) => [p.type, { routePayload: p, value: payloads[i] }] )
    );
}