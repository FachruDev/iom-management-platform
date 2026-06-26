import { Head } from '@inertiajs/react';

export default function Error401() {
    return <ErrorPage status={401} title="Unauthorized" description="User EGIS tidak valid atau belum dikirim." />;
}

function ErrorPage({ status, title, description }: { status: number; title: string; description: string }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <Head title={title} />
            <section className="max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-primary">{status}</p>
                <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{description}</p>
            </section>
        </main>
    );
}
