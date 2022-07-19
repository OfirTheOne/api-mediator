
import { SdkBuilder } from '../lib/core/sdk/sdk-builder'
import { NestFactory } from '@nestjs/core';
import { Controller, Get, Param, Delete, Module, Post, Query, Header, Headers } from "@nestjs/common";
import { ApiHeader, ApiParam, ApiQuery, Endpoint } from "../lib/decorators";
import { AppScannerBuilder } from "../lib/core/app-scanner/app-scanner-builder";

///@ts-ignore
import { MyServiceSdk } from './sdk-service';

class GetByIdParams {
    id: string
}

@Controller('dogs')
class DogsController {

    @Get('/:id')
    getById(@ApiParam({ name: 'id' }) @Param('id') id: number): string {
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
    @Get()
    @Endpoint()
    findAll(
        @ApiQuery({ name: 'name'}) @Query('name') name: string, 
        @ApiQuery({ name: 'age'}) @Query('age') age: number, 
        @ApiHeader({ name: 'userId'}) @Headers('userId') userId: string, 
    ): string {
        return `This action returns all cats, name : ${name}, age: ${age}, userId: ${userId}`;
    }

    @Post('/upload/:fileName')
    uploadStuff(
        @ApiParam({ name: 'fileName' }) @Param('fileName') fileName: string
    ): string {
        return `This action upload stuff fileName ${fileName}`;
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


async function bootstrap() {
    const globalPrefix = 'api/v2';
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(globalPrefix);

    new AppScannerBuilder()
        .setApplication(app)
        .setOnlyDecoratedEndpoint(false)
        .setOutputFile('./sample/app-routing.json')
        .build()
        .scan()

    await app.listen(3000);

    return () => app.close()
    
}

async function main() {
    const killApp = await bootstrap();
    try {
        const sdk = new SdkBuilder()
            .setHost('http://localhost:3000/')
            .setRouting('./sample/app-routing.json')
            .build() as unknown as MyServiceSdk;
    
        const uploadStuffResult = await sdk.api.CatsController.uploadStuff({ fileName: 'my-file-name' });
        console.log(uploadStuffResult.data);
    
        const findAllResult = await sdk.api.CatsController.findAll(
            { name: 'this-is-my-name', age: 2 }, 
            { userId: '123' });
        console.log(findAllResult.data);        
    } catch (error) {
        console.log(error);
    } finally {
        killApp && await killApp();
    }

}


main()
    .then(() => console.log('done'))
    .catch((e) => console.log('Error', e.message))

