import { Head, router, useForm } from '@inertiajs/react';
import { Save, Search, Trash2, Edit3, Building2, FileText } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import type { Department, Paginated } from '@/types';
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
            text: `${department.name} akan dihapus secara permanen.`,
            confirmButtonText: 'Ya, hapus',
        });

        if (confirmed) {
            router.delete(withUserQuery(admin.departments.destroy.url(department.id)));
        }
    }

    return (
        <AppLayout title="Department Management">
            <Head title="Department" />

            <div className="grid gap-6 lg:grid-cols-3 items-start">
                {/* KIRI: Form Input (Tambah / Edit) */}
                <Card className="p-6 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <div className="mb-5 border-b border-slate-50 pb-4 flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/5 text-primary">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800">
                            {editing ? 'Modifikasi Departemen' : 'Registrasi Departemen'}
                        </h2>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nama Department</label>
                            <input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="e.g., Human Resources"
                                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400 text-slate-700"
                            />
                            {form.errors.name && (
                                <p className="mt-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi</label>
                            <textarea
                                value={form.data.description}
                                onChange={(event) => form.setData('description', event.target.value)}
                                placeholder="Tambahkan deskripsi atau ruang lingkup divisi di sini..."
                                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400 text-slate-700 resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={form.processing} className="rounded-xl flex-1 text-xs py-2.5 cursor-pointer">
                                <Save className="h-3.5 w-3.5" /> {editing ? 'Perbarui Data' : 'Simpan Departemen'}
                            </Button>
                            {editing && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="rounded-xl text-xs py-2.5 cursor-pointer"
                                    onClick={() => {
                                        setEditing(null);
                                        form.reset();
                                    }}
                                >
                                    Batal
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(admin.departments.index.url(), preserveUserQuery({ search: new FormData(event.currentTarget).get('search') }), { preserveState: true });
                        }}
                        className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm/40"
                    >
                        <div className="flex-1 relative">
                            <input
                                name="search"
                                defaultValue={filters.search ?? ''}
                                placeholder="Cari departemen berdasarkan nama..."
                                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 pl-9 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400"
                            />
                            <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <Button className="rounded-xl text-xs px-4 cursor-pointer"><Search className="h-3 w-3" /> Cari</Button>
                    </form>

                    {departments.data.length ? (
                        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm/30 p-2">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50">
                                        <th className="px-4 py-4 flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Nama</th>
                                        <th className="px-4 py-4">Deskripsi</th>
                                        <th className="px-4 py-4 text-center"><FileText className="h-3.5 w-3.5 inline mr-1" />Dokumen</th>
                                        <th className="px-4 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/60 font-medium text-slate-600">
                                    {departments.data.map((department) => (
                                        <tr key={department.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-4 py-3.5 font-bold text-slate-800">{department.name}</td>
                                            <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate" title={department.description ?? ''}>
                                                {department.description || 'Tidak ada deskripsi'}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 font-bold text-primary text-[10px]">
                                                    {department.documents_count ?? 0} berkas
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex justify-end items-center gap-1.5">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        className="h-8 w-8 rounded-lg p-0 text-slate-500 hover:text-primary hover:bg-primary/5 hover:border-primary/20 border-slate-200 cursor-pointer"
                                                        onClick={() => {
                                                            setEditing(department);
                                                            form.setData({ name: department.name, description: department.description ?? '' });
                                                        }}
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => void deleteDepartment(department)}
                                                        className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <EmptyState title="Departemen tidak ditemukan" description="Silakan tambah divisi baru atau ubah kata kunci pencarian Anda." />}

                    <div className="mt-4"><Pagination links={departments.links} /></div>
                </div>
            </div>
        </AppLayout>
    );
}
