import { RouteEndpoint } from "../../../models/app-routing";
import { SupportedHttpClient, HttpClientType } from "../../../models/http-client";


export interface HttpClientAdapter {
    type: HttpClientType;
    client: SupportedHttpClient;
    baseUrl: string
    request<T = unknown>(presidingPath: string, config: RouteEndpoint, args: any[]): Promise<T> ;
}