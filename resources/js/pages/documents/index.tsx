import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import documents from '@/routes/documents';
import type { Department, IomDocument, Paginated } from '@/types';
import { resourceArray  } from '@/utils/resource';
import type {ResourceCollection} from '@/utils/resource';
import { preserveUserQuery, withUserQuery } from '@/utils/user-query';

export default function DocumentsIndex({
    documents: items,
    departments,
    filters,
}: {
    documents: Paginated<IomDocument>;
    departments: ResourceCollection<Department>;
    filters: { search?: string; department_id?: string; extension?: string };
}) {
    const departmentOptions = resourceArray(departments);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        router.get(documents.index.url(), preserveUserQuery(Object.fromEntries(data.entries())), { preserveState: true, preserveScroll: true });
    }

    return (
        <AppLayout title="Dokumen IOM">
            <Head title="Dokumen IOM" />
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <form onSubmit={submit} className="grid flex-1 gap-3 md:grid-cols-4">
                    <input name="search" defaultValue={filters.search ?? ''} placeholder="Cari nomor, department, file, uploader" className="rounded-md border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
                    <select name="department_id" defaultValue={filters.department_id ?? ''} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                        <option value="">Semua Department</option>
                        {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                    </select>
                    <Button type="submit"><Search className="h-4 w-4" /> Cari</Button>
                </form>
                <Link href={withUserQuery(documents.create.url())} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-700">
                    <Plus className="h-4 w-4" /> Upload
                </Link>
            </div>
            {items.data.length ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Nomor IOM</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Uploader</th>
                                <th className="px-4 py-3">File</th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {items.data.map((document) => (
                                <tr key={document.id}>
                                    <td className="px-4 py-3 font-medium">{document.iom_number || '-'}</td>
                                    <td className="px-4 py-3">{document.department?.name}</td>
                                    <td className="px-4 py-3">{document.uploader?.name}</td>
                                    <td className="px-4 py-3">{document.files_count ?? document.files?.length ?? 0}</td>
                                    <td className="px-4 py-3">{document.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link href={withUserQuery(documents.show.url(document.id))} className="rounded-md p-2 text-slate-600 hover:bg-slate-100" title="Detail"><Eye className="h-4 w-4" /></Link>
                                            <Link href={withUserQuery(documents.edit.url(document.id))} className="rounded-md p-2 text-slate-600 hover:bg-slate-100" title="Edit"><Edit className="h-4 w-4" /></Link>
                                            <button onClick={() => confirm('Hapus dokumen ini?') && router.delete(withUserQuery(documents.destroy.url(document.id)))} className="rounded-md p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState title="Belum ada dokumen" description="Upload dokumen IOM pertama untuk mulai menggunakan DMS." />
            )}
            <div className="mt-4"><Pagination links={items.links} /></div>
        </AppLayout>
    );
}
