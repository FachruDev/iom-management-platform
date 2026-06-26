import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Eye, Trash2, FileText, Info, Paperclip, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import documents from '@/routes/documents';
import files from '@/routes/documents/files';
import type { IomDocument } from '@/types';
import { confirmAction } from '@/utils/alerts';
import { resourceItem  } from '@/utils/resource';
import type { ResourceItem } from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function DocumentShow({ document }: { document: ResourceItem<IomDocument> }) {
    const item = resourceItem(document);

    async function deleteDocument(): Promise<void> {
        const confirmed = await confirmAction({
            title: 'Hapus dokumen?',
            text: item.iom_number ? `${item.iom_number} akan dihapus.` : 'Dokumen ini akan dihapus.',
            confirmButtonText: 'Ya, hapus',
        });

        if (confirmed) {
            router.delete(withUserQuery(documents.destroy.url(item.id)));
        }
    }

    async function deleteFile(fileId: string, fileName: string): Promise<void> {
        const confirmed = await confirmAction({
            title: 'Hapus attachment?',
            text: `${fileName} akan dihapus dari dokumen ini.`,
            confirmButtonText: 'Ya, hapus',
        });

        if (confirmed) {
            router.delete(withUserQuery(files.destroy.url({ document: item.id, file: fileId })));
        }
    }

    return (
        <AppLayout title="Detail Dokumen">
            <Head title="Detail Dokumen" />

            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <Link href={withUserQuery(documents.index.url())} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity">
                    <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Indeks
                </Link>
                <div className="flex gap-2">
                    <Link href={withUserQuery(documents.edit.url(item.id))} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                        <Edit className="h-3.5 w-3.5" /> Edit Dokumen
                    </Link>
                    <Button variant="danger" onClick={() => void deleteDocument()} className="rounded-xl h-9 text-xs font-bold px-4 cursor-pointer">
                        <Trash2 className="h-3.5 w-3.5" /> Hapus Dokumen
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 items-start">
                <Card className="lg:col-span-2 p-6 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <div className="mb-5 border-b border-slate-50 pb-4 flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/5 text-primary">
                            <FileText className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 truncate">{item.iom_number || 'Tanpa Nomor IOM'}</h2>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2 bg-slate-50/40 border border-slate-100 p-4 rounded-2xl text-xs font-semibold text-slate-600">
                        <div><dt className="text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">Department</dt><dd className="font-bold text-slate-800">{item.department?.name || '-'}</dd></div>
                        <div><dt className="text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">Uploader Personel</dt><dd className="font-bold text-slate-800">{item.uploader?.name || '-'}</dd></div>
                        <div><dt className="text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">Waktu Dibuat</dt><dd className="text-slate-500 font-medium">{item.created_at}</dd></div>
                        <div><dt className="text-slate-400 uppercase text-[10px] tracking-wider mb-0.5">Pembaruan Terakhir</dt><dd className="text-slate-500 font-medium">{item.updated_at}</dd></div>
                    </dl>

                    <div className="mt-5 pt-4 border-t border-slate-50">
                        <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"><Info className="h-3.5 w-3.5" /> Keterangan Catatan</dt>
                        <dd className="mt-2.5 whitespace-pre-wrap text-xs font-medium leading-relaxed bg-slate-50/20 border border-transparent p-3 rounded-xl text-slate-600">{item.description || 'Tidak ada keterangan tambahan.'}</dd>
                    </div>
                </Card>

                <Card className="p-6 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <div className="mb-4 flex items-center gap-2 border-b border-slate-50 pb-3">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                        <h2 className="text-sm font-bold text-slate-800">Lampiran Berkas</h2>
                    </div>

                    <div className="space-y-3">
                        {!item.files?.length ? (
                            <p className="text-xs font-medium text-slate-400 text-center py-4">Tidak ada attachment tersemat.</p>
                        ) : (
                            item.files.map((file) => (
                                <div key={file.id} className="rounded-2xl border border-slate-100 bg-slate-50/30 p-3.5 hover:bg-white hover:shadow-xs transition-all group">
                                    <p className="truncate text-xs font-bold text-slate-700" title={file.original_name}>{file.original_name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                                        <span className="text-primary font-black">{file.extension}</span> • {file.size_label}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        <a href={withUserQuery(files.preview.url({ document: item.id, file: file.id }))} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                            <Eye className="h-3 w-3" /> Lihat <ExternalLink className="h-2.5 w-2.5 opacity-40" />
                                        </a>
                                        <a href={withUserQuery(files.download.url({ document: item.id, file: file.id }))} className="inline-flex h-8 items-center gap-1 px-3 rounded-lg bg-primary text-[11px] font-bold text-white shadow-xs hover:bg-primary/90 transition-colors">
                                            <Download className="h-3 w-3" /> Unduh
                                        </a>
                                        <button onClick={() => void deleteFile(file.id, file.original_name)} className="inline-flex h-8 items-center gap-1 px-2.5 rounded-lg bg-white border border-transparent hover:border-rose-100 text-[11px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all ml-auto cursor-pointer">
                                            <Trash2 className="h-3 w-3" /> Hapus
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
