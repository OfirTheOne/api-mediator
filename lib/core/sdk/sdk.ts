import { ISdkBuilder, RevivedSdk } from "../../models/sdk";
import { HttpClientAdapter } from "./http-client-adapters/http-client-adapter";
import { sdkReviver } from "./sdk-reviver";

export class Sdk {

  public readonly httpClientAdapter: HttpClientAdapter;
  public readonly api: RevivedSdk['api'];

  constructor(builder: ISdkBuilder) {
    this.httpClientAdapter = builder.httpClientAdapter;
    const revivedSdk = sdkReviver(
      builder.host,
      builder.appRouting,
      this.httpClientAdapter
    );
    this.api = revivedSdk.api;
  }
}
