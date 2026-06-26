import { Link, usePage } from '@inertiajs/react';
import { Activity, Building2, FileText, Home, Menu, PanelLeftClose, PanelLeftOpen, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
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

    const userInitial = (props.currentUser?.name || 'U').charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans">
            {open ? (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            ) : null}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white shadow-sm transition-all duration-300 lg:translate-x-0',
                    collapsed ? 'lg:w-24' : 'lg:w-72',
                    'w-72',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className={cn(
                    'flex h-15 items-center border-b border-slate-100 transition-all duration-300',
                    collapsed ? 'lg:justify-center' : 'justify-center'
                )}>
                    <div className={cn('flex items-center min-w-0', collapsed && 'lg:hidden')}>
                        <div className="flex h-10 w-auto items-center justify-center overflow-hidden rounded-lg">
                            <img
                                src="/assets/img/logo_galenium_light.png"
                                alt="Galenium Logo"
                                className="h-10 w-auto object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'IOM Management';
                                }}
                            />
                        </div>
                    </div>

                    {collapsed && (
                        <div className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-1 shadow-sm">
                            <img src="/assets/img/logo_galenium_light.png" alt="G" className="h-6 w-auto object-contain" />
                        </div>
                    )}

                    <button
                        type="button"
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden transition-colors"
                        onClick={() => setOpen(false)}
                        aria-label="Tutup sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = url.startsWith(item.href);
                        const href = withUserQuery(item.href);

                        return (
                            <Link
                                key={item.label}
                                href={href}
                                onClick={() => setOpen(false)}
                                title={collapsed ? item.label : undefined}
                                className={cn(
                                    'group relative flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                                    collapsed ? 'lg:justify-center lg:gap-0 lg:px-3' : 'gap-3.5',
                                    active
                                        ? 'bg-primary/5 text-primary border border-primary/10'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                                )}
                            >
                                {active && !collapsed && (
                                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-primary" />
                                )}

                                <Icon className={cn(
                                    'h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105',
                                    active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                                )} />

                                <span className={cn('transition-opacity duration-200', collapsed && 'lg:hidden')}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden lg:block border-t border-slate-100 p-4 bg-slate-50/50">
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-xs font-bold text-slate-400 hover:bg-white hover:text-slate-700 hover:shadow-sm/40 border border-transparent hover:border-slate-200/60 transition-all duration-200 justify-center"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="h-4 w-4 text-slate-500 animate-pulse" />
                        ) : (
                            <>
                                <PanelLeftClose className="h-4 w-4" />
                                <span>Sembunyikan Menu</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            <div className={cn('transition-all duration-300 flex flex-col min-h-screen', collapsed ? 'lg:pl-24' : 'lg:pl-72')}>

                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-5 lg:px-8 shadow-sm/30">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200/80 p-2.5 text-slate-600 bg-white hover:bg-slate-50 lg:hidden shadow-sm transition-colors"
                            onClick={() => setOpen(true)}
                            aria-label="Buka sidebar"
                        >
                            <Menu className="h-4 w-4" />
                        </button>

                        <div className="hidden sm:block">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                <span className="text-primary/80">IOM Management</span>
                            </div>
                            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                        </div>

                        <h1 className="text-base font-bold text-slate-900 sm:hidden truncate max-w-40">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-800 leading-tight">{props.currentUser?.name}</p>
                            <p className="text-[11px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                                {props.currentUser?.role} <span className="text-slate-300 mx-1">•</span> {props.currentUser?.department.name}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/10 to-primary/5 text-sm font-bold text-primary border border-primary/10 shadow-inner">
                            {userInitial}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-5 lg:p-8 max-w-[1600px] w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
