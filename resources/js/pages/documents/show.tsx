import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import documents from '@/routes/documents';
import files from '@/routes/documents/files';
import type {IomDocument} from '@/types';
import { resourceItem  } from '@/utils/resource';
import type {ResourceItem} from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function DocumentShow({ document }: { document: ResourceItem<IomDocument> }) {
    const item = resourceItem(document);

    return (
        <AppLayout title="Detail Dokumen">
            <Head title="Detail Dokumen" />
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <Link href={withUserQuery(documents.index.url())} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
                <div className="flex gap-2">
                    <Link href={withUserQuery(documents.edit.url(item.id))} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium hover:bg-slate-50">
                        <Edit className="h-4 w-4" /> Edit
                    </Link>
                    <Button variant="danger" onClick={() => confirm('Hapus dokumen ini?') && router.delete(withUserQuery(documents.destroy.url(item.id)))}>
                        <Trash2 className="h-4 w-4" /> Hapus
                    </Button>
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <h2 className="text-lg font-semibold">{item.iom_number || 'Tanpa Nomor IOM'}</h2>
                    <dl className="mt-5 grid gap-4 md:grid-cols-2">
                        <div><dt className="text-xs uppercase text-slate-500">Department</dt><dd className="font-medium">{item.department?.name}</dd></div>
                        <div><dt className="text-xs uppercase text-slate-500">Uploader</dt><dd className="font-medium">{item.uploader?.name}</dd></div>
                        <div><dt className="text-xs uppercase text-slate-500">Dibuat</dt><dd className="font-medium">{item.created_at}</dd></div>
                        <div><dt className="text-xs uppercase text-slate-500">Diperbarui</dt><dd className="font-medium">{item.updated_at}</dd></div>
                    </dl>
                    <div className="mt-5">
                        <dt className="text-xs uppercase text-slate-500">Keterangan</dt>
                        <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.description}</dd>
                    </div>
                </Card>
                <Card>
                    <h2 className="mb-4 text-base font-semibold">Attachment</h2>
                    <div className="space-y-3">
                        {item.files?.map((file) => (
                            <div key={file.id} className="rounded-md border border-slate-200 p-3">
                                <p className="truncate text-sm font-medium">{file.original_name}</p>
                                <p className="text-xs text-slate-500">{file.extension.toUpperCase()} - {file.size_label}</p>
                                <div className="mt-3 flex gap-2">
                                    <a href={withUserQuery(files.download.url({ document: item.id, file: file.id }))} className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-white">
                                        <Download className="h-4 w-4" /> Download
                                    </a>
                                    <button onClick={() => confirm('Hapus attachment ini?') && router.delete(withUserQuery(files.destroy.url({ document: item.id, file: file.id })))} className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 px-3 text-sm font-medium text-red-600">
                                        <Trash2 className="h-4 w-4" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
