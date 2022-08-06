import { HttpPayloadType } from '../../models/app-scanner/http-payload-type';
import { AppRouteing } from '../../models/app-routing';
import { generate } from './service-sdk.template'


describe('service-sdk.template', () => {

  it('generate class single field', () => {

    const appRouteing: AppRouteing = {
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
              "payload": [
                {
                  "name": "name",
                   "type": HttpPayloadType.QUERY,
                  "schemeName": "String"
                },
                {
                  "name": "age",
                  "type": HttpPayloadType.QUERY,
                  "schemeName": "Number"
                },
                {
                  "name": "userId",
                  "type": HttpPayloadType.HEADERS,
                  "schemeName": "String"
                }
              ]
            },
            {
              "name": "uploadStuff",
              "path": "/upload/:fileName",
              "method": "post",
              "payload": [
                {
                  "name": "fileName",
                  "type": HttpPayloadType.PARAMS,
                  "schemeName": "String"
                }
              ]
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
                  "schemeName": "Number"
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

    const expected = `
declare class MyServiceSdk {
  api: {
    cats: {
      findAll: (
        query: { age: Number, name: String },
        headers: { userId: String }
      ) => Promise<any>;
      uploadStuff: (
        params: { fileName: String }
      ) => Promise<any>;
    },
    dogs: {
      getById: (
        params: { id: Number }
      ) => Promise<any>;
      findAll: () => Promise<any>;
      deleteStuff: () => Promise<any>;
    }
  };
}`.trim();

    const actual = generate({ appRouteing, serviceName: 'MyService' }, { removeControllerSuffix: true, toCamelCase: true });
    console.log(actual);
    expect(actual).toEqual(expected);
  });

});