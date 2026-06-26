import { FileSearch } from 'lucide-react';

export function EmptyState({ title = 'Tidak ada data', description = 'Data akan muncul setelah tersedia.' }: { title?: string; description?: string }) {
    return (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center backdrop-blur-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4 shadow-inner/10">
                <FileSearch className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
            <p className="mt-1 max-w-sm text-xs font-medium text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}
