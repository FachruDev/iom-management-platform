import { Head } from '@inertiajs/react';

export default function Error403() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <Head title="Forbidden" />
            <section className="max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-primary">403</p>
                <h1 className="mt-2 text-2xl font-semibold">Forbidden</h1>
                <p className="mt-2 text-sm text-slate-500">Anda tidak memiliki akses untuk halaman atau aksi ini.</p>
            </section>
        </main>
    );
}
