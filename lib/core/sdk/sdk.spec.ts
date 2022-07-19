import { AxiosInstance } from "axios";
import { Sdk } from './sdk'
import { SdkBuilder } from './sdk-builder'
import { HttpClientType } from "../../models/http-client";
import { AppRouteing } from '../../models/app-routing';
import { HttpPayloadType } from "../../models/app-scanner/http-payload-type";


const appRouting: AppRouteing = {
    "globalPrefix": "api/v2",
    "routes": [
        {
            "name": "CatsController",
            "path": "cats",
            "endpoints": [
                {
                    "name": "findAll",
                    "path": "/",
                    "method": "get",
                    "payload": []
                },
                {
                    "name": "uploadStuff",
                    "path": "/upload",
                    "method": "post",
                    "payload": []
                }
            ]
        },
        {
            "name": "DogsController",
            "path": "dogs",
            "endpoints": [
                {
                    "name": "getById",
                    "path": "/:id",
                    "method": "get",
                    "payload": [
                        {
                            "name": "id",
                            "type": HttpPayloadType.PARAMS,
                            "schemeName": "GetByIdParams"
                        }
                    ]
                },
                {
                    "name": "findAll",
                    "path": "/all",
                    "method": "get",
                    "payload": []
                },
                {
                    "name": "deleteStuff",
                    "path": "/remove",
                    "method": "delete",
                    "payload": []
                }
            ]
        }
    ]
};


describe('Sdk', () => {

    const mockAxios: Partial<AxiosInstance> = {
        request: jest.fn(),
        defaults: {
            baseURL: undefined
        }
    };
    const mockHost = 'localhost:3000/';

    let sdk: Sdk;

    beforeAll(() => {
        sdk = new SdkBuilder()
        .setClient(HttpClientType.AXIOS, mockAxios as AxiosInstance)
        .setHost(mockHost)
        .setRouting(appRouting)
        .build();
    })

    afterEach(() => {

    })
  it('should generate a sdk instance according the app routing object.', async () => {
    
    expect(sdk.httpClientAdapter.client).toEqual(mockAxios);
    expect(sdk.httpClientAdapter.type).toEqual(HttpClientType.AXIOS);
    expect(Object.keys(sdk.api).length).toEqual(appRouting.routes.length);
    expect(sdk.httpClientAdapter.baseUrl).toEqual(`${mockHost}${appRouting.globalPrefix}`);

    appRouting.routes.forEach(route => {
        expect(sdk.api).toHaveProperty(route.name);
        route.endpoints.forEach(ep => {
            expect(sdk.api[route.name]).toHaveProperty(ep.name);
            expect(typeof sdk.api[route.name][ep.name] == 'function').toBeTruthy();
        });
    });
   })
})