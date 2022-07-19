
import { readFileSync } from 'fs';

export function readJsonFile<T>(path: string): T {
    const data = readFileSync(path,{encoding:'utf8', flag:'r'});
    return JSON.parse(data);
}