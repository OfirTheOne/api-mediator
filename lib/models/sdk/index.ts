import { AppRouteing } from "../app-routing";
import { HttpClientAdapter } from "../../core/sdk/http-client-adapters/http-client-adapter";

export interface SdkBuilderConfiguration {
    host?: string;
    appRoutingFilePath?: string 
    appRouting?: AppRouteing 
}

export interface RevivedSdk {
    api: Record<string, Record<string, Function>>;
}

export interface ISdkBuilder {
    httpClientAdapter: HttpClientAdapter;
    host: string;
    appRouting: AppRouteing;
}