import { AxiosInstance } from "axios";
import { HttpClientType } from "../../../models/http-client";
import { HttpClientAdapter } from "./http-client-adapter";


export class FetchAdapter implements HttpClientAdapter {
    type: HttpClientType;
    client: AxiosInstance;
    baseUrl: string;
    request<T>(_config: any): Promise<T> {
        throw new Error("Method not implemented.");
    }
} 