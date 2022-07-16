import { INestApplication } from "@nestjs/common";
import { AppRouteing } from "../../models/app-routing";
import { scanApplication } from "./scan-application";
import { inspectionOutputToAppRouting } from "../helpers/routes-data-to-json";
import { writeJsonFile } from "../../utils/write-json-file";
import { generate } from "../../template/service-sdk-class-type/service-sdk.template";

type ProjectOutputFn = (appRouteing: AppRouteing) => unknown;

export class AppScanner {
    protected app: INestApplication;
    protected outputFile?: string;
    protected projectOutputFn?: ProjectOutputFn;
    protected onlyDecoratedEndpoint: boolean;

    constructor(builder: AppScannerBuilder) {
        this.app = builder.app;
        this.onlyDecoratedEndpoint = !!builder.onlyDecoratedEndpoint;
        this.outputFile = builder.outputFile;
        this.projectOutputFn = builder.projectFn;
    }

    scan(): AppRouteing {
        const inspectionData = scanApplication(this.app);
        const appRouteing = inspectionOutputToAppRouting(inspectionData, this.onlyDecoratedEndpoint);
        if (this.outputFile) {
            const projectedAppRouteing = this.projectOutputFn?.(appRouteing) || appRouteing;
            writeJsonFile(this.outputFile, projectedAppRouteing);
        }
        const sdkType = generate({ appRouteing, serviceName: 'MyService' }, undefined);
        writeJsonFile('./sample/sdk-service.d.ts', sdkType);
        return appRouteing;
    }
}

export class AppScannerBuilder {
    protected _outputFile?: string;
    protected _projectFn?: ProjectOutputFn;
    protected _onlyDecoratedEndpoint?: boolean;
    protected _app: INestApplication

    setOnlyDecoratedEndpoint(onlyDecoratedEndpoint: boolean): AppScannerBuilder {
        this._onlyDecoratedEndpoint = onlyDecoratedEndpoint;
        return this;
    }
    setOutputFile(filePathOrFalse: string): AppScannerBuilder {
        this._outputFile = filePathOrFalse;
        return this;
    }
    setProjectOutput(projectFn: ProjectOutputFn): AppScannerBuilder {
        this._projectFn = projectFn;
        return this;
    }
    setApplication(app: INestApplication): AppScannerBuilder {
        this._app = app;
        return this;
    }

    build(): AppScanner {
        this.validate();
        return new AppScanner(this);
    }

    protected validate() {
        if (
            // !this._outputFile || 
            !this._app
        ) {
            throw Error('Invalid arguments');
        }
    }

    get onlyDecoratedEndpoint(): boolean {
        return this._onlyDecoratedEndpoint;
    }
    get outputFile(): string {
        return this._outputFile;
    }
    get projectFn(): ProjectOutputFn {
        return this._projectFn;
    }
    get app(): INestApplication {
        return this._app;
    }

}