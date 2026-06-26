import { Head } from '@inertiajs/react';

export default function Error404() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <Head title="Not Found" />
            <section className="max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-primary">404</p>
                <h1 className="mt-2 text-2xl font-semibold">Not Found</h1>
                <p className="mt-2 text-sm text-slate-500">Data atau halaman tidak ditemukan.</p>
            </section>
        </main>
    );
}
