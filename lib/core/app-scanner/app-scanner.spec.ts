import { NestFactory } from '@nestjs/core';
import { Controller, Delete, Get, Module, Param, Post } from '@nestjs/common';
import { ApiParam, Endpoint } from '../../decorators';
import { HttpPayloadType } from '../../models/app-scanner/http-payload-type';
import { AppScannerBuilder } from './app-scanner-builder';


class GetByIdParams {
  id: string
}

@Controller('dogs')
export class DogsController {

  @Get('/:id')
  getById(@ApiParam({ name: 'id' }) @Param() id: GetByIdParams): string {
    return 'This action returns dog by id';
  }

  @Get('/all')
  findAll(): string {
    return 'This action returns all dogs';
  }

  @Delete('/remove')
  deleteStuff(): string {
    return 'This action delete stuff';
  }
}

@Module({
  controllers: [DogsController],
  imports: [],
})
export class DogsModule { }

@Controller('cats')
export class CatsController {
  @Endpoint()
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Endpoint()
  @Post('/upload')
  uploadStuff(): string {
    return 'This action upload stuff';
  }
}

@Module({
  controllers: [CatsController],
  imports: [DogsModule]
})
export class CatsModule { }

@Module({
  imports: [
    CatsModule
  ],
})
export class AppModule { }


describe('app-scanner', () => {

  it('should run scanApplication on the cats & dogs application and return app data correctly.', async () => {

    const globalPrefix = 'api/v2';
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(globalPrefix);

    const appScanner = new AppScannerBuilder()
      .setApplication(app)
      .build()
      .scan();

    // console.log(JSON.stringify(resultAsJson, undefined, 2))
    expect(appScanner.globalPrefix).toEqual(globalPrefix);
    expect(appScanner.routes.length).toEqual(2);
    expect(appScanner.routes[0].name).toEqual(CatsController.name);
    expect(appScanner.routes[0].path).toEqual('cats');
    expect(appScanner.routes[0].endpoints.length).toEqual(2);
    expect(appScanner.routes[0].endpoints[0]).toEqual({
      "name": "findAll", "path": "/", "method": "get", "payload": []
    });
    expect(appScanner.routes[0].endpoints[1]).toEqual({
      "name": "uploadStuff", "path": "/upload", "method": "post", "payload": []
    });
    expect(appScanner.routes[1].name).toEqual(DogsController.name);
    expect(appScanner.routes[1].path).toEqual('dogs');
    expect(appScanner.routes[1].endpoints.length).toEqual(3);
    expect(appScanner.routes[1].endpoints[0]).toEqual({
      "name": "getById", "path": "/:id", "method": "get",
      "payload": [{ "type": HttpPayloadType.PARAMS, "schemeName": "GetByIdParams", "name": "id" }]
    });
    expect(appScanner.routes[1].endpoints[1]).toEqual({
      "name": "findAll", "path": "/all", "method": "get", "payload": []
    });
    expect(appScanner.routes[1].endpoints[2]).toEqual({
      "name": "deleteStuff", "path": "/remove", "method": "delete", "payload": []
    });
  })
})