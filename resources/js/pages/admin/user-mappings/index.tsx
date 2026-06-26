import { Head, router, useForm } from '@inertiajs/react';
import { Save, Search, Trash2, Edit3, UserPlus, Users, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import admin from '@/routes/admin';
import type { Department, Paginated, UserMapping } from '@/types';
import { confirmAction } from '@/utils/alerts';
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
    const form = useForm<{ user_id: string; name: string; department_id: string; role: UserMapping['role']; active: boolean }>({
        user_id: '',
        name: '',
        department_id: '',
        role: 'User',
        active: true,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (editing) {
            form.put(withUserQuery(admin.userMappings.update.url(editing.id)), { onSuccess: () => setEditing(null) });

            return;
        }

        form.post(withUserQuery(admin.userMappings.store.url()), { onSuccess: () => form.reset() });
    }

    async function deleteUserMapping(mapping: UserMapping): Promise<void> {
        const confirmed = await confirmAction({
            title: 'Hapus user mapping?',
            text: `${mapping.name} (${mapping.user_id}) akan dihapus dari sistem.`,
            confirmButtonText: 'Ya, hapus',
        });

        if (confirmed) {
            router.delete(withUserQuery(admin.userMappings.destroy.url(mapping.id)));
        }
    }

    return (
        <AppLayout title="User Mapping">
            <Head title="User Mapping" />

            <div className="grid gap-6 xl:grid-cols-3 items-start">
                <Card className="p-6 border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                    <div className="mb-5 border-b border-slate-50 pb-4 flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-primary/5 text-primary">
                            <UserPlus className="h-4 w-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800">
                            {editing ? 'Modifikasi Pemetaan' : 'Registrasi User Baru'}
                        </h2>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">User ID EGIS</label>
                            <input
                                value={form.data.user_id}
                                onChange={(event) => form.setData('user_id', event.target.value)}
                                placeholder="Masukkan nomor ID pegawai..."
                                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400 text-slate-700"
                            />
                            {form.errors.user_id && (
                                <p className="mt-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg w-fit">
                                    {form.errors.user_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nama Lengkap</label>
                            <input
                                value={form.data.name}
                                onChange={(event) => form.setData('name', event.target.value)}
                                placeholder="Nama sesuai identitas resmi..."
                                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400 text-slate-700"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Departemen Penempatan</label>
                            <select
                                value={form.data.department_id}
                                onChange={(event) => form.setData('department_id', event.target.value)}
                                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600"
                            >
                                <option value="">Pilih Department</option>
                                {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hak Akses Sistem (Role)</label>
                            <select
                                value={form.data.role}
                                onChange={(event) => form.setData('role', event.target.value as UserMapping['role'])}
                                className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600"
                            >
                                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>

                        <div className="pt-1 flex items-center">
                            <label className="relative inline-flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-600 select-none">
                                <input
                                    type="checkbox"
                                    checked={form.data.active}
                                    onChange={(event) => form.setData('active', event.target.checked)}
                                    className="h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary/20 accent-primary"
                                />
                                Akses Akun Aktif
                            </label>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button type="submit" disabled={form.processing} className="rounded-xl flex-1 text-xs py-2.5 cursor-pointer">
                                <Save className="h-3.5 w-3.5" /> {editing ? 'Perbarui Akses' : 'Simpan User'}
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

                <div className="xl:col-span-2 space-y-4">
                    {/* Filter Bar Bergaya Kapsul */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(admin.userMappings.index.url(), preserveUserQuery(Object.fromEntries(new FormData(event.currentTarget).entries())), { preserveState: true });
                        }}
                        className="grid gap-2 md:grid-cols-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm/40"
                    >
                        <div className="md:col-span-2 relative">
                            <input
                                name="search"
                                defaultValue={filters.search ?? ''}
                                placeholder="Cari berdasarkan nama atau ID..."
                                className="w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 pl-9 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400"
                            />
                            <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <select name="role" defaultValue={filters.role ?? ''} className="rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600">
                            <option value="">Semua Role</option>
                            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <Button className="rounded-xl text-xs cursor-pointer"><Search className="h-3.5 w-3.5" /> Cari</Button>
                    </form>

                    {userMappings.data.length ? (
                        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm/30 p-2">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50">
                                        <th className="px-4 py-4 flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> User</th>
                                        <th className="px-4 py-4">Department</th>
                                        <th className="px-4 py-4"><Shield className="h-3.5 w-3.5 inline mr-1" />Role</th>
                                        <th className="px-4 py-4 text-center">Status</th>
                                        <th className="px-4 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/60 font-medium text-slate-600">
                                    {userMappings.data.map((mapping) => (
                                        <tr key={mapping.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-slate-800">{mapping.name}</p>
                                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{mapping.user_id}</p>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-600">{mapping.department?.name || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-block px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide border",
                                                    mapping.role === 'Admin'
                                                        ? "bg-purple-50 border-purple-100 text-purple-700"
                                                        : mapping.role === 'Viewer'
                                                            ? "bg-sky-50 border-sky-100 text-sky-700"
                                                        : "bg-slate-50 border-slate-200/60 text-slate-600"
                                                )}>
                                                    {mapping.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {mapping.active ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 font-bold text-emerald-700 text-[10px]">
                                                        <CheckCircle2 className="h-3 w-3" /> Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 font-bold text-rose-600 text-[10px]">
                                                        <XCircle className="h-3 w-3" /> Suspend
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end items-center gap-1.5">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        className="h-8 w-8 rounded-lg p-0 text-slate-500 hover:text-primary hover:bg-primary/5 hover:border-primary/20 border-slate-200 cursor-pointer"
                                                        onClick={() => {
                                                            setEditing(mapping);
                                                            form.setData({ user_id: mapping.user_id, name: mapping.name, department_id: String(mapping.department_id), role: mapping.role, active: mapping.active });
                                                        }}
                                                        title="Edit Mapping"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => void deleteUserMapping(mapping)}
                                                        className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer"
                                                        title="Hapus Pemetaan"
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
                    ) : <EmptyState title="User tidak ditemukan" description="Pastikan kata kunci pencarian atau filter hak akses Anda sudah tepat." />}

                    <div className="mt-4"><Pagination links={userMappings.links} /></div>
                </div>
            </div>
        </AppLayout>
    );
}
