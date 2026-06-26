import { Head, Link } from '@inertiajs/react';
import { FilePlus, ListChecks, FileText, ArrowRight, Layers, FolderOpen } from 'lucide-react';
import { Card, StatPanel } from '@/components/ui/card';
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
                <div className="grid gap-4 md:grid-cols-3">
                    <StatPanel title="Total Dokumen Saya" value={stats.my_documents} label="Berkas Terunggah" icon={Layers} color="primary" />

                    <Link href={withUserQuery(documents.create.url())} className="group flex items-center gap-4 rounded-2xl bg-purple-50/60 p-4 border border-transparent hover:border-purple-200 transition-all duration-200">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-200/70 text-purple-800 shadow-sm/10 group-hover:scale-105 transition-transform">
                            <FilePlus className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-purple-900 transition-colors flex items-center gap-1">
                                Upload Dokumen <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">Tambah berkas memo IOM baru</p>
                        </div>
                    </Link>

                    <Link href={withUserQuery(documents.index.url())} className="group flex items-center gap-4 rounded-2xl bg-sky-50/60 p-4 border border-transparent hover:border-sky-200 transition-all duration-200">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-200/70 text-sky-800 shadow-sm/10 group-hover:scale-105 transition-transform">
                            <ListChecks className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-sky-900 transition-colors flex items-center gap-1">
                                Daftar Dokumen <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">Lihat dan kelola berkas Anda</p>
                        </div>
                    </Link>
                </div>

                <Card>
                    <div className="mb-4 border-b border-slate-50 pb-4">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-primary" /> Riwayat Berkas Terakhir
                        </h2>
                    </div>

                    <div className="space-y-1">
                        {uploads.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum ada data berkas</p>
                            </div>
                        ) : (
                            uploads.map((document) => (
                                <Link 
                                    key={document.id} 
                                    href={withUserQuery(documents.show.url(document.id))} 
                                    className="flex items-center justify-between py-2.5 px-2 rounded-xl group hover:bg-slate-50 transition-colors"
                                >
                                    <div className="min-w-0 flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors truncate">
                                                {document.iom_number || 'Tanpa Nomor IOM'}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                                {document.department?.name || 'General'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            {document.files?.length ?? 0} Lampiran
                                        </span>
                                        <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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