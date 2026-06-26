import { Link, usePage } from '@inertiajs/react';
import { Activity, Building2, FileText, Home, Menu, Users } from 'lucide-react';
import {  useState } from 'react';
import type {ReactNode} from 'react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import documents from '@/routes/documents';
import { withUserQuery } from '@/utils/user-query';

const nav = [
    { label: 'Dashboard', href: dashboard.url(), icon: Home, admin: false },
    { label: 'Dokumen', href: documents.index.url(), icon: FileText, admin: false },
    { label: 'Department', href: admin.departments.index.url(), icon: Building2, admin: true },
    { label: 'User Mapping', href: admin.userMappings.index.url(), icon: Users, admin: true },
    { label: 'Activity Log', href: admin.activityLog.index.url(), icon: Activity, admin: true },
];

export default function AppLayout({ title, children }: { title: string; children: ReactNode }) {
    const { props, url } = usePage();
    const [open, setOpen] = useState(false);
    const isAdmin = Boolean(props.permissions?.isAdmin);
    const items = nav.filter((item) => !item.admin || isAdmin);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <aside className={cn('fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white transition lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
                <div className="flex h-16 items-center border-b border-slate-200 px-5">
                    <div>
                        <p className="text-sm font-semibold text-primary">IOM Management</p>
                        <p className="text-xs text-slate-500">Document Management System</p>
                    </div>
                </div>
                <nav className="space-y-1 p-3">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = url.startsWith(item.href);
                        const href = withUserQuery(item.href);

                        return (
                            <Link key={item.label} href={href} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium', active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100')}>
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <button className="rounded-md p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle sidebar">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div>
                            <p className="text-xs text-slate-500">IOM Management System</p>
                            <h1 className="text-lg font-semibold text-slate-950">{title}</h1>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{props.currentUser?.name}</p>
                        <p className="text-xs text-slate-500">{props.currentUser?.role} - {props.currentUser?.department.name}</p>
                    </div>
                </header>
                {props.flash?.success ? <div className="mx-4 mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 lg:mx-6">{props.flash.success}</div> : null}
                {props.flash?.error ? <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 lg:mx-6">{props.flash.error}</div> : null}
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
