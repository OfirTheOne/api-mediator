import { INestApplication } from "@nestjs/common";

/**
 * 
 * @param app Nest application 
 * @returns {string} the app global prefix, in not exists return empty string. 
 */
 export function extractAppGlobalPrefix(app: INestApplication): string {
    const { config } = app as any;
    return config?.getGlobalPrefix() || '';
}
