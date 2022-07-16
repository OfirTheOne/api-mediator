import { AppRouteing } from '../../models/app-routing';
import { ApplicationInspectionData } from '../../models/app-scanner';


/**
 * 
 * @param {ApplicationInspectionData} param0 
 * @returns output to be digest by the sdk reviver, and to be serialized.
 */
export function inspectionOutputToAppRouting({ routes, globalPrefix}: ApplicationInspectionData, onlyDecoratedEndpoint = false ): AppRouteing {
    const routesAsList = Array.from(routes.entries())
        .map(([ctrlName, ctrlData]) => ({
            name: ctrlName,
            path: ctrlData.controllerPath,
            endpoints: ctrlData.controllerRoutes
                .filter(({ additionalMetadata }) => !onlyDecoratedEndpoint || additionalMetadata?.endpointDecorated )
                .map(({ reqMethodName, path, httpMethod, httpPayloadArgs = [] }) => (
                    { 
                        name: reqMethodName, path, 
                        method: httpMethod, 
                        payload: httpPayloadArgs?.map(
                            ({httpPayloadType, model, name}) => ({ name, type: httpPayloadType, schemeName: model?.name })
                        ) 
                    }
                ))
        }));
    return {
        globalPrefix,
        routes: routesAsList
    };
}
