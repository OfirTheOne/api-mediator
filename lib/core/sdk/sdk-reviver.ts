import { RevivedSdk } from "../../models/sdk";
import { AppRouteing, RouteComponent } from "../../models/app-routing";
import { resolvePathsToUrl } from "../helpers/resolve-paths-to-url";
import { HttpClientAdapter } from "./http-client-adapters/http-client-adapter";

const rcToSdkSegment = (rc: RouteComponent, http: HttpClientAdapter) => {
  return rc.endpoints
    .reduce((acc, ep) => ({
      ...acc,
      [ep.name]: (...args: any[]) => http.request(rc.path, ep, args)
    }),  <Record<string, Function>>{});
}

export function sdkReviver(host: string, appRouteing: AppRouteing, client: HttpClientAdapter): RevivedSdk {
  client.baseUrl = resolvePathsToUrl(host, appRouteing.globalPrefix);

  return {
    api: appRouteing.routes
      .reduce((acc, rc) => ({ ...acc, [rc.name]: rcToSdkSegment(rc, client) }), 
        <Record<string, Record<string, Function>>>{})
  }
}

