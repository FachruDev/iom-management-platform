import { FileSearch } from 'lucide-react';

export function EmptyState({ title = 'Tidak ada data', description = 'Data akan muncul setelah tersedia.' }: { title?: string; description?: string }) {
    return (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <FileSearch className="h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
        </div>
    );
}
