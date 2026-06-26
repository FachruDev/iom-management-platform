import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2, FileText, Folder, User2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import documents from '@/routes/documents';
import type { Department, IomDocument, Paginated } from '@/types';
import { confirmAction } from '@/utils/alerts';
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
    const { props } = usePage();
    const departmentOptions = resourceArray(departments);

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        router.get(documents.index.url(), preserveUserQuery(Object.fromEntries(data.entries())), { preserveState: true, preserveScroll: true });
    }

    async function deleteDocument(document: IomDocument): Promise<void> {
        const confirmed = await confirmAction({
            title: 'Hapus dokumen?',
            text: document.iom_number ? `${document.iom_number} akan dihapus.` : 'Dokumen ini akan dihapus.',
            confirmButtonText: 'Ya, hapus',
        });

        if (confirmed) {
            router.delete(withUserQuery(documents.destroy.url(document.id)));
        }
    }

    return (
        <AppLayout title="Dokumen IOM">
            <Head title="Dokumen IOM" />

            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <form onSubmit={submit} className="grid flex-1 gap-3 sm:grid-cols-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm/40">
                    <div className="sm:col-span-2 relative">
                        <input name="search" defaultValue={filters.search ?? ''} placeholder="Cari nomor IOM, divisi, berkas, atau pengunggah..." className="w-full rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 pl-9 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-400" />
                        <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div className="flex gap-2">
                        <select name="department_id" defaultValue={filters.department_id ?? ''} className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50/40 px-3 py-2.5 text-xs font-semibold focus:border-primary focus:bg-white focus:outline-hidden transition-all text-slate-600">
                            <option value="">Semua Department</option>
                            {departmentOptions.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                        </select>
                        <Button type="submit" className="rounded-xl text-xs px-4 cursor-pointer"><Search className="h-3.5 w-3.5" /> Cari</Button>
                    </div>
                </form>

                {props.permissions.canCreateDocuments && (
                    <Link href={withUserQuery(documents.create.url())} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-sm shadow-primary/10 hover:bg-primary/90 active:scale-[0.98] transition-all whitespace-nowrap">
                        <Plus className="h-4 w-4" /> Upload IOM
                    </Link>
                )}
            </div>

            {items.data.length ? (
                <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm/30 p-2">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50">
                                <th className="px-4 py-4 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Nomor IOM</th>
                                <th className="px-4 py-4"><Folder className="h-3.5 w-3.5 inline mr-1" />Department</th>
                                <th className="px-4 py-4"><User2 className="h-3.5 w-3.5 inline mr-1" />Uploader</th>
                                <th className="px-4 py-4"><Calendar className="h-3.5 w-3.5 inline mr-1" />Effective Date</th>
                                <th className="px-4 py-4 text-center">Berkas</th>
                                <th className="px-4 py-4"><Calendar className="h-3.5 w-3.5 inline mr-1" />Tanggal</th>
                                <th className="px-4 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/60 font-medium text-slate-600">
                            {items.data.map((document) => (
                                <tr key={document.id} className="hover:bg-slate-50/60 transition-colors group">
                                    <td className="px-4 py-3.5 font-bold text-slate-800">{document.iom_number || '-'}</td>
                                    <td className="px-4 py-3.5 font-semibold text-slate-600">{document.department?.name}</td>
                                    <td className="px-4 py-3.5 text-slate-500">{document.uploader?.name}</td>
                                    <td className="px-4 py-3.5 text-slate-500">{document.effective_date || '-'}</td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/40 text-[10px] font-bold text-slate-500">
                                            {document.files_count ?? document.files?.length ?? 0} file
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-400">{document.created_at}</td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex justify-end items-center gap-1.5">
                                            <Link href={withUserQuery(documents.show.url(document.id))} className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white shadow-xs transition-all" title="Detail">
                                                <Eye className="h-3.5 w-3.5" />
                                            </Link>
                                            {document.can?.edit && (
                                                <Link href={withUserQuery(documents.edit.url(document.id))} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 shadow-xs transition-all" title="Edit">
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            {document.can?.delete && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => void deleteDocument(document)}
                                                    className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
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
