import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, FileEdit, UploadCloud } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileDropzone } from '@/components/ui/file-dropzone';
import AppLayout from '@/layouts/app-layout';
import documents from '@/routes/documents';
import type { Department, IomDocument } from '@/types';
import { resourceArray, resourceItem   } from '@/utils/resource';
import type {ResourceCollection, ResourceItem} from '@/utils/resource';
import { withUserQuery } from '@/utils/user-query';

export default function DocumentForm({
    mode,
    document,
    departments,
}: {
    mode: 'create' | 'edit';
    document: ResourceItem<IomDocument> | null;
    departments: ResourceCollection<Department>;
}) {
    const { props } = usePage();
    const existing = document ? resourceItem(document) : null;
    const departmentOptions = resourceArray(departments);
    const form = useForm<{
        iom_number: string;
        department_id: string;
        description: string;
        files: File[];
    }>({
        iom_number: existing?.iom_number ?? '',
        department_id: existing?.department_id ? String(existing.department_id) : '',
        description: existing?.description ?? '',
        files: [],
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (mode === 'create') {
            form.post(withUserQuery(documents.store.url()), { forceFormData: true });

            return;
        }

        if (existing) {
            form.post(withUserQuery(documents.update.url(existing.id, { query: { _method: 'PUT' } })), { forceFormData: true });
        }
    }

    return (
        <AppLayout title={mode === 'create' ? 'Upload Dokumen' : 'Edit Dokumen'}>
            <Head title={mode === 'create' ? 'Upload Dokumen' : 'Edit Dokumen'} />

            <div className="mb-5">
                <Link href={withUserQuery(existing ? documents.show.url(existing.id) : documents.index.url())} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity">
                    <ArrowLeft className="h-3.5 w-3.5" /> Kembali
                </Link>
            </div>

            <Card className="p-6 max-w-4xl border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="mb-6 border-b border-slate-50 pb-4 flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-primary/5 text-primary">
                        <FileEdit className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800">
                        {mode === 'create' ? 'Registrasi Dokumen Baru' : 'Perbarui Berkas Dokumen'}
                    </h2>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nomor IOM</label>
                            <input value={form.data.iom_number} onChange={(event) => form.setData('iom_number', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400 text-slate-700" placeholder="e.g., IOM-001" />
                            {form.errors.iom_number && <p className="mt-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">{form.errors.iom_number}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Department</label>
                            <select value={form.data.department_id} onChange={(event) => form.setData('department_id', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600">
                                <option value="">Pilih Department</option>
                                {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                            </select>
                            {form.errors.department_id && <p className="mt-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">{form.errors.department_id}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Keterangan / Deskripsi Ringkas</label>
                        <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} rows={5} placeholder="Tuliskan catatan internal memo atau rincian lampiran di sini..." className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400 text-slate-700 resize-none" />
                        {form.errors.description && <p className="mt-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">{form.errors.description}</p>}
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><UploadCloud className="h-3.5 w-3.5 text-slate-400" /> Attachment Berkas</label>
                        <div className="mt-1.5">
                            <FileDropzone
                                files={form.data.files}
                                onChange={(files) => form.setData('files', files)}
                                allowedExtensions={props.iomConfig.allowedExtensions}
                                maxFileSizeKb={props.iomConfig.maxFileSizeKb}
                            />
                        </div>
                        {form.errors.files && <p className="mt-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">{form.errors.files}</p>}

                        {form.progress && (
                            <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                                    <span>Mengunggah Berkas</span>
                                    <span className="text-primary">{form.progress.percentage}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200/70 overflow-hidden">
                                    <div className="h-full rounded-full bg-primary transition-all duration-150" style={{ width: `${form.progress.percentage}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-50">
                        <Button type="submit" disabled={form.processing} className="rounded-xl px-6 text-xs py-2.5 cursor-pointer">
                            <Save className="h-3.5 w-3.5" /> Simpan Dokumen
                        </Button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}
