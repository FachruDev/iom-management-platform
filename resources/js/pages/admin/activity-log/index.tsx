import { Head, Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, StatCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { ActivityLog, Paginated } from '@/types';
import { resourceArray  } from '@/utils/resource';
import type {ResourceCollection} from '@/utils/resource';
import { preserveUserQuery, withUserQuery } from '@/utils/user-query';

export default function ActivityLogIndex({
    activities,
    latestActivities,
    todayCount,
    activeUsers,
    modules,
    activityTypes,
    filters,
}: {
    activities: Paginated<ActivityLog>;
    latestActivities: ResourceCollection<ActivityLog>;
    todayCount: number;
    activeUsers: { user_id: string; user_name: string; total: number }[];
    modules: string[];
    activityTypes: string[];
    filters: Record<string, string | undefined>;
}) {
    const latest = resourceArray(latestActivities);

    return (
        <AppLayout title="Activity Log">
            <Head title="Activity Log" />
            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <StatCard title="Aktivitas Hari Ini" value={todayCount} />
                <Card className="md:col-span-2">
                    <h2 className="mb-3 text-base font-semibold">User Paling Aktif</h2>
                    <div className="grid gap-2 md:grid-cols-3">
                        {activeUsers.slice(0, 3).map((user) => <div key={user.user_id} className="rounded-md bg-slate-50 p-3 text-sm"><p className="font-medium">{user.user_name || user.user_id}</p><p className="text-slate-500">{user.total} aktivitas</p></div>)}
                    </div>
                </Card>
            </div>
            <form onSubmit={(event) => {
 event.preventDefault(); router.get(admin.activityLog.index.url(), preserveUserQuery(Object.fromEntries(new FormData(event.currentTarget).entries())), { preserveState: true }); 
}} className="mb-4 grid gap-2 lg:grid-cols-6">
                <input name="search" defaultValue={filters.search ?? ''} placeholder="Search" className="rounded-md border border-slate-200 px-3 py-2 text-sm lg:col-span-2" />
                <select name="module" defaultValue={filters.module ?? ''} className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option value="">Semua Modul</option>{modules.map((module) => <option key={module} value={module}>{module}</option>)}</select>
                <select name="activity" defaultValue={filters.activity ?? ''} className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option value="">Semua Aktivitas</option>{activityTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>
                <input type="date" name="date_from" defaultValue={filters.date_from ?? ''} className="rounded-md border border-slate-200 px-3 py-2 text-sm" />
                <Button><Search className="h-4 w-4" /> Filter</Button>
            </form>
            <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    {activities.data.length ? (
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Modul</th><th className="px-4 py-3">Aktivitas</th><th className="px-4 py-3">Detail</th></tr></thead>
                                <tbody className="divide-y divide-slate-200">
                                    {activities.data.map((activity) => (
                                        <tr key={activity.id}>
                                            <td className="px-4 py-3">{activity.created_at}</td>
                                            <td className="px-4 py-3">{activity.user_name || '-'}</td>
                                            <td className="px-4 py-3">{activity.module}</td>
                                            <td className="px-4 py-3">{activity.activity}</td>
                                            <td className="px-4 py-3"><Link href={withUserQuery(admin.activityLog.show.url(activity.id))} className="font-medium text-primary">Lihat</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState title="Belum ada aktivitas" />}
                    <div className="mt-4"><Pagination links={activities.links} /></div>
                </div>
                <Card>
                    <h2 className="mb-4 text-base font-semibold">10 Aktivitas Terakhir</h2>
                    <div className="space-y-3">
                        {latest.map((activity) => <div key={activity.id} className="rounded-md border border-slate-200 p-3 text-sm"><p className="font-medium">{activity.activity}</p><p className="text-xs text-slate-500">{activity.user_name || '-'} - {activity.created_at}</p></div>)}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
