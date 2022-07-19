import { HttpPayloadType } from "../../models/app-scanner/http-payload-type";

export class EndpointMeta {
    endpointDecorated: boolean = false;
    args: Set<{ name: string, type: HttpPayloadType, index: number, paramType?: Function }> = new Set();
    constructor(public endpointName: string | symbol) { }
}