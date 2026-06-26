import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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
            <div className="mb-4">
                <Link href={withUserQuery(existing ? documents.show.url(existing.id) : documents.index.url())} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
            </div>
            <Card>
                <form onSubmit={submit} className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium">Nomor IOM</label>
                            <input value={form.data.iom_number} onChange={(event) => form.setData('iom_number', event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="IOM-001" />
                            {form.errors.iom_number ? <p className="mt-1 text-sm text-red-600">{form.errors.iom_number}</p> : null}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Department</label>
                            <select value={form.data.department_id} onChange={(event) => form.setData('department_id', event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                                <option value="">Pilih Department</option>
                                {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                            </select>
                            {form.errors.department_id ? <p className="mt-1 text-sm text-red-600">{form.errors.department_id}</p> : null}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Keterangan</label>
                        <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} rows={5} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        {form.errors.description ? <p className="mt-1 text-sm text-red-600">{form.errors.description}</p> : null}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Attachment</label>
                        <div className="mt-1">
                            <FileDropzone
                                files={form.data.files}
                                onChange={(files) => form.setData('files', files)}
                                allowedExtensions={props.iomConfig.allowedExtensions}
                                maxFileSizeKb={props.iomConfig.maxFileSizeKb}
                            />
                        </div>
                        {form.errors.files ? <p className="mt-1 text-sm text-red-600">{form.errors.files}</p> : null}
                        {form.progress ? <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-primary" style={{ width: `${form.progress.percentage}%` }} /></div> : null}
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.processing}><Save className="h-4 w-4" /> Simpan</Button>
                    </div>
                </form>
            </Card>
        </AppLayout>
    );
}
