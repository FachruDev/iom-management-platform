import { Head, Link } from '@inertiajs/react';
import {
    Activity, FilePlus, FileText, Users, Building2,
    CalendarDays, FileSpreadsheet, ArrowRight, ShieldCheck,
    Clock, Award
} from 'lucide-react';
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

            <div className="space-y-8">
                {/* Section: Overview Stats */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Ringkasan Eksekutif</h3>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard title="Total Dokumen" value={stats.total_documents} icon={FileText} variant="gradient" />
                        <StatCard title="Total User" value={stats.total_users} icon={Users} variant="gradient" />
                        <StatCard title="Total Department" value={stats.total_departments} icon={Building2} variant="gradient" />
                        <StatCard title="Upload Hari Ini" value={stats.uploads_today} icon={CalendarDays} variant="gradient" meta={`Akumulasi Bulan Ini: ${stats.uploads_this_month}`} />
                    </div>
                </div>

                {/* Section: Document Type Breakdown */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Metrik Format Ekstensi</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="group flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm/50 transition-all duration-300 hover:border-red-200 hover:bg-red-50/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100 group-hover:scale-105 transition-transform"><FileText className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Berkas PDF</p>
                                    <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.pdf_count}</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider">.pdf</span>
                        </div>
                        <div className="group flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm/50 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform"><FileText className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dokumen Word</p>
                                    <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.word_count}</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">.docx</span>
                        </div>
                        <div className="group flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm/50 transition-all duration-300 hover:border-emerald-200 hover:bg-emerald-50/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform"><FileSpreadsheet className="h-5 w-5" /></div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spreadsheet Excel</p>
                                    <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.excel_count}</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">.xlsx</span>
                        </div>
                    </div>
                </div>

                {/* Section: Main Content Split */}
                <div className="grid gap-6 xl:grid-cols-3">
                    {/* Recent Uploads Card */}
                    <Card className="xl:col-span-2 p-6 flex flex-col justify-between border-slate-200/70 shadow-sm">
                        <div>
                            <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-primary" /> Log Unggahan Terbaru
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Monitoring pembaruan berkas berkala pada repositori pusat</p>
                                </div>
                                <Link href={withUserQuery(documents.create.url())} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/95 hover:shadow transition-all">
                                    <FilePlus className="h-3.5 w-3.5" /> Upload File
                                </Link>
                            </div>
                            <div className="space-y-1">
                                {uploads.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">Belum ada dokumen yang diunggah.</p>
                                ) : (
                                    uploads.map((document) => (
                                        <Link key={document.id} href={withUserQuery(documents.show.url(document.id))} className="flex items-center justify-between py-3 px-3 rounded-xl group hover:bg-slate-50 transition-all duration-200">
                                            <div className="min-w-0 pr-4 flex items-center gap-3.5">
                                                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/20 group-hover:bg-white group-hover:border-slate-200 shadow-sm/30 transition-colors">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{document.iom_number || 'Tanpa Nomor IOM'}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                        <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{document.department?.name || 'No Dept'}</span>
                                                        <span>•</span>
                                                        <span className="truncate max-w-37.5">{document.uploader?.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Buka Dokumen</span>
                                                <ArrowRight className="h-4 w-4 text-slate-400 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Recent Activities Card */}
                    <Card className="p-6 border-slate-200/70 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-500" /> Riwayat Sistem
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Catatan aktivitas dan interaksi user</p>
                                </div>
                                <Link href={withUserQuery(adminRoutes.activityLog.index.url())} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                                    Selengkapnya
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {activities.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">Tidak ada aktivitas terdeteksi.</p>
                                ) : (
                                    activities.map((activity) => (
                                        <div key={activity.id} className="relative pl-4 border-l-2 border-slate-200 hover:border-primary/50 transition-colors py-1 group">
                                            <div className="absolute -left-1.25 top-2 h-2 w-2 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                                            <p className="text-xs font-bold text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">{activity.activity}</p>
                                            <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                                                <span className="text-slate-500 font-semibold">{activity.user_name || 'System'}</span>
                                                <span>•</span>
                                                <span className="uppercase tracking-widest text-[9px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold">{activity.module}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Section: Most Active Users */}
                <Card className="border-slate-200/70 shadow-sm p-6">
                    <div className="mb-5 border-b border-slate-100 pb-4">
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Award className="h-4 w-4 text-amber-500" /> Kontributor Teraktif
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Daftar personel dengan frekuensi manajemen berkas tertinggi</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {activeUsers.map((user, idx) => {
                            const initial = (user.user_name || 'U').charAt(0).toUpperCase();
                            const colors = [
                                'bg-indigo-50 text-indigo-700 border-indigo-100',
                                'bg-emerald-50 text-emerald-700 border-emerald-100',
                                'bg-amber-50 text-amber-700 border-amber-100',
                                'bg-purple-50 text-purple-700 border-purple-100',
                                'bg-cyan-50 text-cyan-700 border-cyan-100'
                            ];
                            const colorClass = colors[idx % colors.length];

                            return (
                                <div key={user.user_id} className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/40 p-3.5 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold border shadow-inner/20 group-hover:scale-105 transition-transform">
                                        {initial}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-extrabold text-slate-800" title={user.user_name}>{user.user_name || user.user_id}</p>
                                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                                            <span className="text-slate-600 font-bold">{user.total}</span> Tindakan
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
