import { Head, router, useForm } from '@inertiajs/react';
import { Save, Search, Trash2 } from 'lucide-react';
import {  useState } from 'react';
import type {FormEvent} from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type {Department, Paginated} from '@/types';
import { confirmAction } from '@/utils/alerts';
import { preserveUserQuery, withUserQuery } from '@/utils/user-query';

export default function DepartmentsIndex({ departments, filters }: { departments: Paginated<Department>; filters: { search?: string } }) {
    const [editing, setEditing] = useState<Department | null>(null);
    const form = useForm({ name: '', description: '' });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (editing) {
            form.put(withUserQuery(admin.departments.update.url(editing.id)), { onSuccess: () => setEditing(null) });

            return;
        }

        form.post(withUserQuery(admin.departments.store.url()), { onSuccess: () => form.reset() });
    }

    async function deleteDepartment(department: Department): Promise<void> {
        const confirmed = await confirmAction({
            title: 'Hapus department?',
            text: `${department.name} akan dihapus.`,
            confirmButtonText: 'Ya, hapus',
        });

        if (confirmed) {
            router.delete(withUserQuery(admin.departments.destroy.url(department.id)));
        }
    }

    return (
        <AppLayout title="Department">
            <Head title="Department" />
            <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                    <h2 className="mb-4 text-base font-semibold">{editing ? 'Edit Department' : 'Tambah Department'}</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nama Department</label>
                            <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                            {form.errors.name ? <p className="mt-1 text-sm text-red-600">{form.errors.name}</p> : null}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <textarea value={form.data.description} onChange={(event) => form.setData('description', event.target.value)} className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={4} />
                        </div>
                        <Button type="submit" disabled={form.processing}><Save className="h-4 w-4" /> Simpan</Button>
                    </form>
                </Card>
                <div className="lg:col-span-2">
                    <form onSubmit={(event) => {
 event.preventDefault(); router.get(admin.departments.index.url(), preserveUserQuery({ search: new FormData(event.currentTarget).get('search') }), { preserveState: true }); 
}} className="mb-4 flex gap-2">
                        <input name="search" defaultValue={filters.search ?? ''} placeholder="Cari department" className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        <Button><Search className="h-4 w-4" /> Cari</Button>
                    </form>
                    {departments.data.length ? (
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Deskripsi</th><th className="px-4 py-3">Dokumen</th><th className="px-4 py-3 text-right">Aksi</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {departments.data.map((department) => (
                                        <tr key={department.id}>
                                            <td className="px-4 py-3 font-medium">{department.name}</td>
                                            <td className="px-4 py-3">{department.description || '-'}</td>
                                            <td className="px-4 py-3">{department.documents_count ?? 0}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="secondary" className="h-8" onClick={() => {
 setEditing(department); form.setData({ name: department.name, description: department.description ?? '' }); 
}}>Edit</Button>
                                                    <button onClick={() => void deleteDepartment(department)} className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState />}
                    <div className="mt-4"><Pagination links={departments.links} /></div>
                </div>
            </div>
        </AppLayout>
    );
}
