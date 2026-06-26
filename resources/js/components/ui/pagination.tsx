import { Link } from '@inertiajs/react';
import { withUserQuery } from '@/utils/user-query';
import { cn } from '@/lib/utils';

type LinkItem = { url: string | null; label: string; active: boolean };

export function Pagination({ links }: { links?: LinkItem[] }) {
    if (!links?.length) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center gap-1.5 bg-white p-2 border border-slate-100 rounded-2xl w-fit shadow-sm/20">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={withUserQuery(link.url)}
                        preserveScroll
                        className={cn(
                            'flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-bold transition-all duration-200 select-none border',
                            link.active
                                ? 'bg-primary border-primary text-white shadow-sm shadow-primary/20'
                                : 'bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-xs font-bold text-slate-300 border border-transparent bg-slate-50/50 cursor-not-allowed select-none"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
