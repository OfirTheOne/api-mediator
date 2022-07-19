import axios from "axios";
import { HttpClientType, SupportedHttpClient } from "../../../models/http-client";
import { AxiosAdapter } from "./axios-adapter";


export function createHttpClientAdapter(type?: HttpClientType, client?: SupportedHttpClient) {

    if(type === undefined) {
        return new AxiosAdapter(axios.create());
    }
    if(type === HttpClientType.AXIOS) {
        return new AxiosAdapter(client)
    } else {
        throw Error('currently support axios only')
    }
}