import { UploadCloud, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';

export function FileDropzone({
    files,
    onChange,
    allowedExtensions,
    maxFileSizeKb,
}: {
    files: File[];
    onChange: (files: File[]) => void;
    allowedExtensions: string[];
    maxFileSizeKb: number;
}) {
    const [error, setError] = useState<string | null>(null);

    const addFiles = useCallback(
        (incoming: FileList | File[]) => {
            const next = Array.from(incoming);
            const invalid = next.find((file) => {
                const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
                return !allowedExtensions.includes(extension) || file.size / 1024 > maxFileSizeKb;
            });

            if (invalid) {
                setError(`Berkas "${invalid.name}" format tidak didukung atau ukuran melebihi ${Math.round(maxFileSizeKb / 1024)} MB.`);
                return;
            }

            setError(null);
            onChange([...files, ...next]);
        },
        [allowedExtensions, files, maxFileSizeKb, onChange],
    );

    return (
        <div className="space-y-4">
            <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    addFiles(event.dataTransfer.files);
                }}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all duration-300 hover:border-primary hover:bg-white hover:shadow-sm"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10 group-hover:scale-105 transition-transform duration-300">
                    <UploadCloud className="h-5 w-5" />
                </div>

                <span className="mt-4 text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">
                    Drag & drop attachment atau klik untuk memilih
                </span>
                <span className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {allowedExtensions.join(', ')} • Maks {Math.round(maxFileSizeKb / 1024)} MB per file
                </span>
                <input type="file" multiple className="hidden" onChange={(event) => event.target.files && addFiles(event.target.files)} />
            </label>

            {error && (
                <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl w-fit">
                    {error}
                </p>
            )}

            {files.length ? (
                <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Berkas Terlampir ({files.length})</p>
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white pl-4 pr-2 py-2 text-xs font-semibold text-slate-700 shadow-sm/30 group/file transition-colors hover:bg-slate-50/50">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary/40 group-hover/file:bg-primary transition-colors" />
                                <span className="truncate max-w-md">{file.name}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                className="h-8 w-8 rounded-xl p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                                onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
