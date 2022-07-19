
import { camelCase } from '../../utils/camel-case';
import { AppRouteing, RouteEndpoint, RoutePayload } from '../../models/app-routing'
import { HttpPayloadType } from 'lib/models/app-scanner/http-payload-type';
 
interface Ctx {
  appRouteing: AppRouteing;
  serviceName: string;
}


function buildPayloadMap(payloads: RoutePayload[]): Map<HttpPayloadType, RoutePayload[]> {
  const payloadMap = new Map<HttpPayloadType, RoutePayload[]>()
  payloads.forEach((p) => {
    const payloadList = payloadMap.get(p.type);
    payloadMap.set(p.type, [p, ...payloadList || []]);
  });
  return payloadMap;
}

function generatePayloadSchemaType(type: HttpPayloadType, payloads: RoutePayload[]): string {
  return `${ type }: { ${payloads.map(p => `${p.name}: ${p.schemeName}` ).join(', ')} }`;
}

function generateEndpointMethodType(ep: RouteEndpoint): string {
  const payloadMap = buildPayloadMap(ep.payload);
  return ep.payload.length > 0 ? `${ ep.name }: (${ 
    '\n        ' + Array.from(payloadMap.entries())
    .map(([type, payloads]) => generatePayloadSchemaType(type, payloads))
    .join(',\n        ') +
    '\n      '}) => Promise<any>;` : 
    `${ ep.name }: () => Promise<any>;`;
}

const generateComponent = (ctx: Ctx) =>   `
declare class ${ctx.serviceName}Sdk {
  api: {${ctx.appRouteing.routes.map(route => `
    ${route.name}: {
      ${ route.endpoints.map((ep) => generateEndpointMethodType(ep)
      ).join('\n      ')}
    }`)}
  };
}
`.trim()
export function generate(ctx: Ctx, options: any) {
    if(options?.removeControllerSuffix) {
        ctx.appRouteing.routes.forEach(route => route.name = route.name.replace(/(Controller$)/, '') ); 
    }
    if(options?.toCamelCase) { 
      ctx.appRouteing.routes.forEach(route => route.name = camelCase(route.name) );
    
    }

    return generateComponent(ctx)
}
