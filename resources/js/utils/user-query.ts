import type { FormDataConvertible } from '@inertiajs/core';

type QueryData = Record<string, FormDataConvertible>;

function currentUserId(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }

    return new URLSearchParams(window.location.search).get('user_id');
}

export function withUserQuery(url: string): string {
    const userId = currentUserId();

    if (!userId) {
        return url;
    }

    const [path, query = ''] = url.split('?');
    const parameters = new URLSearchParams(query);
    parameters.set('user_id', userId);

    const queryString = parameters.toString();

    return queryString ? `${path}?${queryString}` : path;
}

export function preserveUserQuery(data: QueryData = {}): QueryData {
    const userId = currentUserId();

    if (!userId) {
        return data;
    }

    return {
        ...data,
        user_id: userId,
    };
}
