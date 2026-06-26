import { Head, Link } from '@inertiajs/react';
import { FilePlus, ListChecks, FileText, ArrowRight, Layers, FolderOpen } from 'lucide-react';
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

            <div className="space-y-6">
                {/* Top Actions & Analytics Grid */}
                <div className="grid gap-5 md:grid-cols-3">
                    <StatCard title="Total Dokumen Saya" value={stats.my_documents} icon={Layers} variant="gradient" />

                    <Link href={withUserQuery(documents.create.url())} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-md">
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:bg-primary/10" />
                        <div className="relative z-10">
                            <div className="p-3 w-fit rounded-xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:scale-105 shadow-sm/40 transition-all duration-300">
                                <FilePlus className="h-5 w-5" />
                            </div>
                            <p className="mt-5 text-sm font-extrabold text-slate-800 group-hover:text-primary transition-colors">Registrasi Dokumen Baru</p>
                            <p className="mt-1.5 text-xs text-slate-400 font-medium leading-relaxed">Unggah draf atau memo internal (IOM) baru ke dalam basis data korporat terpusat.</p>
                        </div>
                        <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                            <span>Mulai Pengisian</span>
                            <ArrowRight className="h-4 w-4 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                        </div>
                    </Link>

                    <Link href={withUserQuery(documents.index.url())} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-md">
                        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-slate-400/5 blur-xl transition-all duration-500 group-hover:bg-slate-400/10" />
                        <div className="relative z-10">
                            <div className="p-3 w-fit rounded-xl bg-slate-50 text-slate-600 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 group-hover:scale-105 shadow-sm/40 transition-all duration-300">
                                <ListChecks className="h-5 w-5" />
                            </div>
                            <p className="mt-5 text-sm font-extrabold text-slate-800 group-hover:text-slate-900 transition-colors">Eksplorasi Arsip Saya</p>
                            <p className="mt-1.5 text-xs text-slate-400 font-medium leading-relaxed">Telusuri seluruh riwayat pengiriman dokumen, status verifikasi, dan lampiran Anda.</p>
                        </div>
                        <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-600 opacity-80 group-hover:opacity-100 group-hover:text-slate-900 transition-all">
                            <span>Buka Repositori</span>
                            <ArrowRight className="h-4 w-4 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                        </div>
                    </Link>
                </div>

                {/* Recent Uploads Table/List View */}
                <Card className="border-slate-200/70 shadow-sm p-6">
                    <div className="mb-5 border-b border-slate-100 pb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                <FolderOpen className="h-4 w-4 text-primary" /> Log Aktivitas Upload Anda
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Memantau status mutakhir dari berkas dokumen terakhir yang Anda kelola</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {uploads.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2.5" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arsip Kosong</p>
                                <p className="text-xs text-slate-400 mt-0.5">Anda belum memiliki berkas terunggah saat ini.</p>
                            </div>
                        ) : (
                            uploads.map((document) => (
                                <Link
                                    key={document.id}
                                    href={withUserQuery(documents.show.url(document.id))}
                                    className="flex items-center justify-between py-3 px-3 rounded-xl group hover:bg-slate-50/80 transition-all duration-200"
                                >
                                    <div className="min-w-0 pr-4 flex items-center gap-3.5">
                                        <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-100 group-hover:border-slate-200 text-slate-500 shadow-sm/20 transition-all">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-slate-800 truncate group-hover:text-primary transition-colors">
                                                {document.iom_number || 'Tanpa Nomor IOM'}
                                            </p>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                                {document.department?.name || 'General Management'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-200/50 shadow-inner/10">
                                            {document.files?.length ?? 0} Dokumen Lampiran
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
