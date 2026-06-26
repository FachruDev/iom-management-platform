import { Head, router, useForm } from '@inertiajs/react';
import { Save, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { Department, Paginated, UserMapping } from '@/types';
import { resourceArray  } from '@/utils/resource';
import type {ResourceCollection} from '@/utils/resource';
import { preserveUserQuery, withUserQuery } from '@/utils/user-query';

export default function UserMappingsIndex({
    userMappings,
    departments,
    roles,
    filters,
}: {
    userMappings: Paginated<UserMapping>;
    departments: ResourceCollection<Department>;
    roles: string[];
    filters: { search?: string; role?: string; active?: string };
}) {
    const departmentOptions = resourceArray(departments);
    const [editing, setEditing] = useState<UserMapping | null>(null);
    const form = useForm({ user_id: '', name: '', department_id: '', role: 'User', active: true as boolean });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (editing) {
            form.put(withUserQuery(admin.userMappings.update.url(editing.id)), { onSuccess: () => setEditing(null) });

            return;
        }

        form.post(withUserQuery(admin.userMappings.store.url()), { onSuccess: () => form.reset() });
    }

    return (
        <AppLayout title="User Mapping">
            <Head title="User Mapping" />
            <div className="grid gap-6 xl:grid-cols-3">
                <Card>
                    <h2 className="mb-4 text-base font-semibold">{editing ? 'Edit User Mapping' : 'Tambah User Mapping'}</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <input value={form.data.user_id} onChange={(event) => form.setData('user_id', event.target.value)} placeholder="user_id EGIS" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        {form.errors.user_id ? <p className="text-sm text-red-600">{form.errors.user_id}</p> : null}
                        <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} placeholder="Nama" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
                        <select value={form.data.department_id} onChange={(event) => form.setData('department_id', event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                            <option value="">Pilih Department</option>
                            {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                        </select>
                        <select value={form.data.role} onChange={(event) => form.setData('role', event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.data.active} onChange={(event) => form.setData('active', event.target.checked)} /> Aktif</label>
                        <Button type="submit" disabled={form.processing}><Save className="h-4 w-4" /> Simpan</Button>
                    </form>
                </Card>
                <div className="xl:col-span-2">
                    <form onSubmit={(event) => {
 event.preventDefault(); router.get(admin.userMappings.index.url(), preserveUserQuery(Object.fromEntries(new FormData(event.currentTarget).entries())), { preserveState: true }); 
}} className="mb-4 grid gap-2 md:grid-cols-4">
                        <input name="search" defaultValue={filters.search ?? ''} placeholder="Cari user" className="rounded-md border border-slate-200 px-3 py-2 text-sm md:col-span-2" />
                        <select name="role" defaultValue={filters.role ?? ''} className="rounded-md border border-slate-200 px-3 py-2 text-sm"><option value="">Semua Role</option>{roles.map((role) => <option key={role} value={role}>{role}</option>)}</select>
                        <Button><Search className="h-4 w-4" /> Cari</Button>
                    </form>
                    {userMappings.data.length ? (
                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Aktif</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
                                <tbody className="divide-y divide-slate-200">
                                    {userMappings.data.map((mapping) => (
                                        <tr key={mapping.id}>
                                            <td className="px-4 py-3"><p className="font-medium">{mapping.name}</p><p className="text-xs text-slate-500">{mapping.user_id}</p></td>
                                            <td className="px-4 py-3">{mapping.department?.name}</td>
                                            <td className="px-4 py-3">{mapping.role}</td>
                                            <td className="px-4 py-3">{mapping.active ? 'Ya' : 'Tidak'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Button type="button" variant="secondary" className="h-8" onClick={() => {
 setEditing(mapping); form.setData({ user_id: mapping.user_id, name: mapping.name, department_id: String(mapping.department_id), role: mapping.role, active: mapping.active }); 
}}>Edit</Button>
                                                    <button onClick={() => confirm('Hapus user mapping ini?') && router.delete(withUserQuery(admin.userMappings.destroy.url(mapping.id)))} className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState />}
                    <div className="mt-4"><Pagination links={userMappings.links} /></div>
                </div>
            </div>
        </AppLayout>
    );
}
