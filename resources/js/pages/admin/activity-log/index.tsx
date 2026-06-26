import { Head, Link, router } from '@inertiajs/react';
import { Search, Clock, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, StatPanel } from '@/components/ui/card';
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

            {/* Top Grid: Berbasis Panel Pastel */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <StatPanel title="Aktivitas Hari Ini" value={todayCount} label="Tindakan Tercatat" icon={Clock} color="primary" />
                <Card className="md:col-span-2 p-5">
                    <h2 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-slate-400">Kontributor Teraktif Saat Ini</h2>
                    <div className="grid gap-3 md:grid-cols-3">
                        {activeUsers.slice(0, 3).map((user) => (
                            <div key={user.user_id} className="flex items-center gap-3 rounded-xl bg-purple-50/50 border border-purple-100/30 p-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700 uppercase">
                                    {(user.user_name || 'U').charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-xs text-slate-700 truncate">{user.user_name || user.user_id}</p>
                                    <p className="text-[10px] font-semibold text-purple-600 mt-0.5">{user.total} aktivitas</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Form Filter Bergaya Rounded Kapsul */}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    router.get(admin.activityLog.index.url(), preserveUserQuery(Object.fromEntries(new FormData(event.currentTarget).entries())), { preserveState: true });
                }}
                className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm/40"
            >
                <div className="lg:col-span-2 relative">
                    <input name="search" defaultValue={filters.search ?? ''} placeholder="Cari aktivitas atau user..." className="w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 pl-9 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400" />
                    <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                </div>
                <select name="module" defaultValue={filters.module ?? ''} className="rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600">
                    <option value="">Semua Modul</option>
                    {modules.map((module) => <option key={module} value={module}>{module}</option>)}
                </select>
                <select name="activity" defaultValue={filters.activity ?? ''} className="rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600">
                    <option value="">Semua Aktivitas</option>
                    {activityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <input type="date" name="date_from" defaultValue={filters.date_from ?? ''} className="rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-500" />

                {/* Button Aksi dengan Identitas Warna Utama (Primary) */}
                <Button className="rounded-xl h-auto py-2.5 text-xs"><Search className="h-3.5 w-3.5" /> Terapkan</Button>
            </form>

            {/* Main Log Section */}
            <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2 space-y-4">
                    {activities.data.length ? (
                        <div className="overflow-x-auto rounded-[24px] border border-slate-100 bg-white shadow-sm/30 p-2">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50">
                                        <th className="px-4 py-4 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Waktu</th>
                                        <th className="px-4 py-4">User</th>
                                        <th className="px-4 py-4">Modul</th>
                                        <th className="px-4 py-4">Aktivitas</th>
                                        <th className="px-4 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/60 font-medium text-slate-600">
                                    {activities.data.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">{activity.created_at}</td>
                                            <td className="px-4 py-3.5 font-bold text-slate-700">{activity.user_name || '-'}</td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/30 text-[10px] uppercase font-bold text-slate-500 tracking-wide">{activity.module}</span>
                                            </td>
                                            <td className="px-4 py-3.5 max-w-xs truncate text-slate-600" title={activity.activity}>{activity.activity}</td>
                                            <td className="px-4 py-3.5 text-center">
                                                <Link href={withUserQuery(admin.activityLog.show.url(activity.id))} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white shadow-xs transition-all">
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState title="Belum ada aktivitas" />}
                    <div><Pagination links={activities.links} /></div>
                </div>

                {/* Right Sidebar: Timeline Gaya Pop Dinamis */}
                <Card className="p-6">
                    <div className="mb-5 border-b border-slate-50 pb-4">
                        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" /> 10 Aktivitas Terakhir
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {latest.map((activity) => (
                            <div key={activity.id} className="relative pl-5 border-l-2 border-slate-100 py-1 group">
                                <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-slate-300 group-hover:bg-primary shadow-xs transition-all duration-300 group-hover:scale-110" />
                                <p className="text-xs font-bold text-slate-700 leading-normal group-hover:text-slate-900 transition-colors">{activity.activity}</p>
                                <p className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                                    <span className="text-slate-500">{activity.user_name || 'System'}</span>
                                    <span>•</span>
                                    <span>{activity.created_at}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
