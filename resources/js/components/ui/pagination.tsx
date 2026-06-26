import { Link } from '@inertiajs/react';
import { withUserQuery } from '@/utils/user-query';

type LinkItem = { url: string | null; label: string; active: boolean };

export function Pagination({ links }: { links?: LinkItem[] }) {
    if (!links?.length) {
        return null;
    }

    return (
        <nav className="flex flex-wrap gap-2">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={withUserQuery(link.url)}
                        preserveScroll
                        className={`rounded-md border px-3 py-2 text-sm ${link.active ? 'border-primary bg-primary text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </nav>
    );
}
