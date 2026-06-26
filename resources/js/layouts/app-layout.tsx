import { Link, usePage } from '@inertiajs/react';
import { Activity, Building2, FileText, Home, Menu, PanelLeftClose, PanelLeftOpen, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {ReactNode} from 'react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import documents from '@/routes/documents';
import { showErrorAlert, showSuccessToast } from '@/utils/alerts';
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
    const [collapsed, setCollapsed] = useState(false);
    const isAdmin = Boolean(props.permissions?.isAdmin);
    const items = nav.filter((item) => !item.admin || isAdmin);

    useEffect(() => {
        if (props.flash?.success) {
            showSuccessToast(props.flash.success);
        }
    }, [props.flash?.success]);

    useEffect(() => {
        if (props.flash?.error) {
            showErrorAlert(props.flash.error);
        }
    }, [props.flash?.error]);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {open ? <button type="button" aria-label="Tutup sidebar" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} /> : null}
            <aside className={cn('fixed inset-y-0 left-0 z-40 border-r border-slate-200 bg-white transition-all duration-200 lg:translate-x-0', collapsed ? 'lg:w-20' : 'lg:w-72', 'w-72', open ? 'translate-x-0' : '-translate-x-full')}>
                <div className={cn('flex h-16 items-center border-b border-slate-200 px-4', collapsed ? 'lg:justify-center' : 'justify-between')}>
                    <div className={cn(collapsed && 'lg:hidden')}>
                        <p className="text-sm font-semibold text-primary">IOM Management</p>
                        <p className="text-xs text-slate-500">Document Management System</p>
                    </div>
                    <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup sidebar">
                        <X className="h-5 w-5" />
                    </button>
                    <button type="button" className="hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:inline-flex" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                        {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                    </button>
                </div>
                <nav className="space-y-1 p-3">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = url.startsWith(item.href);
                        const href = withUserQuery(item.href);

                        return (
                            <Link key={item.label} href={href} onClick={() => setOpen(false)} title={collapsed ? item.label : undefined} className={cn('flex items-center rounded-md px-3 py-2 text-sm font-medium', collapsed ? 'lg:justify-center lg:gap-0' : 'gap-3', active ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100')}>
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className={cn(collapsed && 'lg:hidden')}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <div className={cn('transition-all duration-200', collapsed ? 'lg:pl-20' : 'lg:pl-72')}>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <button type="button" className="rounded-md p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Buka sidebar">
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
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
