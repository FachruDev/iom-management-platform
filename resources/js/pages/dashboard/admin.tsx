import { Head, Link } from '@inertiajs/react';
import { 
    FilePlus, FileText, ArrowRight, ShieldCheck,
    Clock, Award, Users, Building2, CalendarDays, FileSpreadsheet 
} from 'lucide-react';
import { Card, StatPanel } from '@/components/ui/card';
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

            <div className="space-y-6">
                <Card>
                    <div className="mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ikhtisar Sistem Berkas</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatPanel title="Total Dokumen" value={stats.total_documents} label="Berkas Terarsip" icon={FileText} color="primary" />
                        <StatPanel title="Total User" value={stats.total_users} label="Pengguna Aktif" icon={Users} color="purple" />
                        <StatPanel title="Total Department" value={stats.total_departments} label="Divisi Terpetakan" icon={Building2} color="blue" />
                        <StatPanel title="Hari Ini" value={stats.uploads_today} label={`(${stats.uploads_this_month} bulan ini)`} icon={CalendarDays} color="green" />
                    </div>
                </Card>

                <Card>
                    <div className="mb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statistik Ekstensi Dokumen</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <StatPanel title="File PDF" value={stats.pdf_count} label="Dokumen PDF" icon={FileText} color="red" />
                        <StatPanel title="File Word" value={stats.word_count} label="Dokumen Word" icon={FileText} color="blue" />
                        <StatPanel title="File Excel" value={stats.excel_count} label="Lembar Tabel" icon={FileSpreadsheet} color="green" />
                    </div>
                </Card>

                <div className="grid gap-6 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                        <div className="mb-5 flex items-center justify-between border-b border-slate-50 pb-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> Log Unggahan Terbaru
                                </h2>
                            </div>
                            <Link href={withUserQuery(documents.create.url())} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/80 duration-300 transition-colors">
                                <FilePlus className="h-3.5 w-3.5" /> Upload File
                            </Link>
                        </div>
                        <div className="space-y-1">
                            {uploads.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-6">Belum ada berkas masuk.</p>
                            ) : (
                                uploads.map((document) => (
                                    <Link key={document.id} href={withUserQuery(documents.show.url(document.id))} className="flex items-center justify-between py-2.5 px-2 rounded-xl group hover:bg-slate-50 transition-colors">
                                        <div className="min-w-0 flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-slate-700">{document.iom_number || 'Tanpa Nomor IOM'}</p>
                                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                                    {document.department?.name} • <span className="text-slate-500 font-medium">{document.uploader?.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                        <div>
                            <div className="mb-6 flex items-start justify-between border-b border-slate-50 pb-4">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" /> Riwayat Sistem
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Catatan aktivitas dan interaksi user terbaru</p>
                                </div>
                                <Link href={withUserQuery(adminRoutes.activityLog.index.url())} className="text-xs font-bold text-primary hover:opacity-80 transition-opacity">
                                    Selengkapnya
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                {activities.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">Tidak ada aktivitas terdeteksi.</p>
                                ) : (
                                    activities.map((activity) => (
                                        <div key={activity.id} className="relative pl-5 border-l-2 border-slate-100 hover:border-primary/30 transition-colors py-1 group">
                                            {/* Indikator Titik Menyala khas Timeline (Warna Primary) */}
                                            <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-slate-300 group-hover:bg-primary shadow-sm transition-all duration-300 group-hover:scale-110" />
                                            
                                            <p className="text-xs font-bold text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                                                {activity.activity}
                                            </p>
                                            
                                            <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                                                <span className="text-slate-500">{activity.user_name || 'System'}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="uppercase tracking-widest text-[9px] px-1.5 py-0.5 bg-primary/5 border border-primary/10 rounded font-bold text-primary">
                                                    {activity.module}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <div className="mb-4 flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        <h2 className="text-base font-bold text-slate-800">Personel Paling Aktif</h2>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {activeUsers.map((user) => (
                            <div key={user.user_id} className="rounded-xl bg-slate-50/50 border border-slate-100 p-3 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary uppercase">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-bold text-slate-700" title={user.user_name}>{user.user_name || user.user_id}</p>
                                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{user.total} kegiatan</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
