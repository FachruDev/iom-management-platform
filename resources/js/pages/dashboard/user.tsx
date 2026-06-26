import { Head, Link } from '@inertiajs/react';
import { FilePlus, ListChecks } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import documents from '@/routes/documents';
import type { IomDocument } from '@/types';
import { resourceArray  } from '@/utils/resource';
import type {ResourceCollection} from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function UserDashboard({ stats, recentUploads }: { stats: Record<string, number>; recentUploads: ResourceCollection<IomDocument> }) {
    const uploads = resourceArray(recentUploads);

    return (
        <AppLayout title="Dashboard User">
            <Head title="Dashboard User" />
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="Total Dokumen Saya" value={stats.my_documents} />
                <Link href={withUserQuery(documents.create.url())} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-primary">
                    <FilePlus className="h-8 w-8 text-primary" />
                    <p className="mt-4 font-semibold">Upload Dokumen</p>
                    <p className="text-sm text-slate-500">Tambah IOM baru dengan multiple attachment.</p>
                </Link>
                <Link href={withUserQuery(documents.index.url())} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-primary">
                    <ListChecks className="h-8 w-8 text-primary" />
                    <p className="mt-4 font-semibold">Daftar Dokumen</p>
                    <p className="text-sm text-slate-500">Lihat dan kelola dokumen milik Anda.</p>
                </Link>
            </div>
            <Card className="mt-6">
                <h2 className="mb-4 text-base font-semibold">Upload Terbaru</h2>
                <div className="space-y-3">
                    {uploads.map((document) => (
                        <Link key={document.id} href={withUserQuery(documents.show.url(document.id))} className="block rounded-md border border-slate-200 p-3 hover:bg-slate-50">
                            <p className="font-medium">{document.iom_number || 'Tanpa Nomor IOM'}</p>
                            <p className="text-sm text-slate-500">{document.department?.name} - {document.files?.length ?? 0} file</p>
                        </Link>
                    ))}
                </div>
            </Card>
        </AppLayout>
    );
}
