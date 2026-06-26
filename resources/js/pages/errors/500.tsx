import { Head } from '@inertiajs/react';

export default function Error500() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <Head title="Server Error" />
            <section className="max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-primary">500</p>
                <h1 className="mt-2 text-2xl font-semibold">Server Error</h1>
                <p className="mt-2 text-sm text-slate-500">Terjadi kesalahan pada server.</p>
            </section>
        </main>
    );
}
