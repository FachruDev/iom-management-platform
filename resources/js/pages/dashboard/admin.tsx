import { Head, Link } from '@inertiajs/react';
import { Activity, FilePlus, FileText } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import adminRoutes from '@/routes/admin';
import documents from '@/routes/documents';
import type { ActivityLog, IomDocument } from '@/types';
import { resourceArray  } from '@/utils/resource';
import type {ResourceCollection} from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function AdminDashboard({
    stats,
    recentUploads,
    recentActivities,
    activeUsers,
}: {
    stats: Record<string, number>;
    recentUploads: ResourceCollection<IomDocument>;
    recentActivities: ResourceCollection<ActivityLog>;
    activeUsers: { user_id: string; user_name: string; total: number }[];
}) {
    const uploads = resourceArray(recentUploads);
    const activities = resourceArray(recentActivities);

    return (
        <AppLayout title="Dashboard Admin">
            <Head title="Dashboard Admin" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Dokumen" value={stats.total_documents} />
                <StatCard title="Total User" value={stats.total_users} />
                <StatCard title="Total Department" value={stats.total_departments} />
                <StatCard title="Upload Hari Ini" value={stats.uploads_today} />
                <StatCard title="Upload Bulan Ini" value={stats.uploads_this_month} />
                <StatCard title="Jumlah PDF" value={stats.pdf_count} />
                <StatCard title="Jumlah Word" value={stats.word_count} />
                <StatCard title="Jumlah Excel" value={stats.excel_count} />
            </div>
            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold">Recent Upload</h2>
                        <Link href={withUserQuery(documents.create.url())} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                            <FilePlus className="h-4 w-4" /> Upload
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {uploads.map((document) => (
                            <Link key={document.id} href={withUserQuery(documents.show.url(document.id))} className="flex items-center justify-between rounded-md border border-slate-200 p-3 hover:bg-slate-50">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{document.iom_number || 'Tanpa Nomor IOM'}</p>
                                    <p className="truncate text-xs text-slate-500">{document.department?.name} - {document.uploader?.name}</p>
                                </div>
                                <FileText className="h-4 w-4 text-slate-400" />
                            </Link>
                        ))}
                    </div>
                </Card>
                <Card>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold">Aktivitas Terbaru</h2>
                        <Link href={withUserQuery(adminRoutes.activityLog.index.url())} className="text-sm font-medium text-primary">Detail</Link>
                    </div>
                    <div className="space-y-3">
                        {activities.map((activity) => (
                            <div key={activity.id} className="rounded-md border border-slate-200 p-3">
                                <p className="text-sm font-medium">{activity.activity}</p>
                                <p className="text-xs text-slate-500">{activity.user_name || '-'} - {activity.module}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <Card className="mt-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><Activity className="h-4 w-4" /> User Paling Aktif</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {activeUsers.map((user) => (
                        <div key={user.user_id} className="rounded-md bg-slate-50 p-3">
                            <p className="truncate text-sm font-medium">{user.user_name || user.user_id}</p>
                            <p className="text-xs text-slate-500">{user.total} aktivitas</p>
                        </div>
                    ))}
                </div>
            </Card>
        </AppLayout>
    );
}
