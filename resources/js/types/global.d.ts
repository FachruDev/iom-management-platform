import type { CurrentUser } from '@/types/iom';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            currentUser: CurrentUser | null;
            permissions: { isAdmin: boolean };
            flash: { success?: string | null; error?: string | null };
            iomConfig: { maxFileSizeKb: number; allowedExtensions: string[] };
            [key: string]: unknown;
        };
    }
}
