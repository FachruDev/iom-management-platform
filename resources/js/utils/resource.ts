export type ResourceCollection<T> = T[] | { data: T[] };
export type ResourceItem<T> = T | { data: T };

export function resourceArray<T>(value: ResourceCollection<T> | null | undefined): T[] {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : value.data;
}

export function resourceItem<T>(value: ResourceItem<T>): T {
    return 'data' in (value as { data?: T }) ? (value as { data: T }).data : (value as T);
}
