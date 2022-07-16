import { AxiosInstance } from "axios";
import { Sdk } from "./sdk";
import { createHttpClientAdapter } from "./http-client-adapters/create-http-client-adapter";
import { HttpClientAdapter } from "./http-client-adapters/http-client-adapter";
import { readJsonFile } from "../../utils/read-json-file";
import { AppRouteing,  } from "../../models/app-routing";
import { SupportedHttpClient, HttpClientType } from "../../models/http-client";
import { ISdkBuilder, SdkBuilderConfiguration } from "../../models/sdk";

export class SdkBuilder implements ISdkBuilder {

  protected _client?: SupportedHttpClient;
  protected _clientType?: HttpClientType;
  protected _host: string;
  protected _appRoutingPath: string;
  protected _appRouting: AppRouteing;
  protected _httpClientAdapter: HttpClientAdapter;

  setConfig(config: SdkBuilderConfiguration): SdkBuilder {
    this.setHost(this._host);
    this.setRouting(config.appRouting || config.appRoutingFilePath);
    return this;
  }
  setHost(host: string): SdkBuilder {
    this._host = host || '/';
    return this;
  }
  setRouting(appRouting: AppRouteing | string): SdkBuilder {
    if (typeof appRouting == 'string') {
      this._appRoutingPath = appRouting;
    } else {
      this._appRouting = appRouting;
    }
    return this;
  }
  setClient(type: HttpClientType.AXIOS, client: AxiosInstance): SdkBuilder;
  setClient(type: HttpClientType, client: SupportedHttpClient): SdkBuilder {
    this._client = client;
    this._clientType = type;
    this._httpClientAdapter = createHttpClientAdapter(this._clientType, this._client)
    return this;
  }

  build(): Sdk {
    this.validate();
    this._appRouting = this._appRouting ? this._appRouting : readJsonFile(this._appRoutingPath);
    this._httpClientAdapter = this._httpClientAdapter ?? createHttpClientAdapter(this._clientType, this._client); 

    return new Sdk(this);
  }

  protected validate() {
    if (!this._host || !(this._appRouting || this._appRoutingPath)) {
      throw Error('Invalid arguments');
    }
  }


  get client(): SupportedHttpClient {
    return this._client;
  }
  get clientType(): HttpClientType {
    return this._clientType;
  }
  get httpClientAdapter(): HttpClientAdapter {
    return this._httpClientAdapter;
  }
  get host(): string {
    return this._host;
  }
  get appRoutingPath(): string {
    return this._appRoutingPath;
  }
  get appRouting(): AppRouteing {
    return this._appRouting;
  }
}