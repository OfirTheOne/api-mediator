export function resolvePathsToUrl(...paths: Array<string>) {
    return paths.join('/').replace(/([^:]\/)\/+/g, "$1");
}
