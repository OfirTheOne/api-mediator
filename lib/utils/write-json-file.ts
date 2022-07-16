
import { writeFileSync } from 'fs';

export function writeJsonFile<T>(path: string, data: unknown): void {
    writeFileSync(path, (typeof data == 'object' ? JSON.stringify(data) : data) as any);
}