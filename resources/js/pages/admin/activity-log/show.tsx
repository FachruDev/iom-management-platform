import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Code, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { ActivityLog } from '@/types';
import { resourceItem  } from '@/utils/resource';
import type { ResourceItem } from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function ActivityLogShow({ activity }: { activity: ResourceItem<ActivityLog> }) {
    const item = resourceItem(activity);

    return (
        <AppLayout title="Detail Activity Log">
            <Head title="Detail Activity Log" />

            {/* Tombol Kembali Menggunakan Warna Identitas Primary */}
            <Link href={withUserQuery(admin.activityLog.index.url())} className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar
            </Link>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Informasi Audit */}
                <Card className="p-6">
                    <div className="mb-5 border-b border-slate-50 pb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <h2 className="text-sm font-bold text-slate-800">Metadata Rekaman Aktivitas</h2>
                    </div>

                    <dl className="space-y-4 text-xs font-semibold text-slate-600">
                        <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                            <dt className="text-slate-400 uppercase tracking-wider text-[10px] flex items-center">User Pelaksana</dt>
                            <dd className="col-span-2 font-bold text-slate-800 text-sm">{item.user_name || '-'} <span className="text-xs font-normal text-slate-400">({item.user_id || '-'})</span></dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-3 py-1">
                            <dt className="text-slate-400">Departemen</dt>
                            <dd className="col-span-2 font-bold text-slate-700">{item.department || '-'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-3 py-1">
                            <dt className="text-slate-400">Modul Sistem</dt>
                            <dd className="col-span-2"><span className="inline-block bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wide">{item.module}</span></dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-3 py-1">
                            <dt className="text-slate-400">Deskripsi Aktivitas</dt>
                            <dd className="col-span-2 font-bold text-slate-800 leading-relaxed">{item.activity}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-3 py-1">
                            <dt className="text-slate-400">Referensi Model</dt>
                            <dd className="col-span-2 font-mono text-slate-500">{item.model || '-'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-3 py-1">
                            <dt className="text-slate-400">ID Record</dt>
                            <dd className="col-span-2 font-bold text-slate-700">{item.record_id || '-'}</dd>
                        </div>
                        <div className="grid grid-cols-3 gap-2 bg-slate-50/30 p-3 rounded-xl border border-transparent mt-2">
                            <dt className="text-slate-400 flex items-center">IP & User Agent</dt>
                            <dd className="col-span-2 font-mono text-[11px] text-slate-500 leading-normal break-all">{item.ip_address || '-'} <span className="block text-[10px] text-slate-400 mt-1 font-sans font-semibold">{item.user_agent || '-'}</span></dd>
                        </div>
                    </dl>
                </Card>

                {/* Detail Perubahan Objek JSON */}
                <Card className="p-6">
                    <div className="mb-5 border-b border-slate-50 pb-4 flex items-center gap-2">
                        <Code className="h-4 w-4 text-slate-500" />
                        <h2 className="text-sm font-bold text-slate-800">Payload Mutasi Perubahan Data</h2>
                    </div>
                    <div className="relative group rounded-2xl overflow-hidden shadow-inner">
                        {/* Hiasan Header Panel Code */}
                        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800/60">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Layers className="h-3 w-3" /> JSON Schema Object</span>
                            <div className="flex gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                                <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                                <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                            </div>
                        </div>
                        <pre className="max-h-96 overflow-auto bg-slate-950 p-4 text-[11px] font-mono leading-relaxed text-emerald-400 scrollbar-thin scrollbar-thumb-slate-800">
                            {JSON.stringify({ old_values: item.old_values, new_values: item.new_values }, null, 2)}
                        </pre>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
