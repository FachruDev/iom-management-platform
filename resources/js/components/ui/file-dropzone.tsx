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
                setError(`File ${invalid.name} tidak sesuai tipe atau melebihi batas ${Math.round(maxFileSizeKb / 1024)} MB.`);
                return;
            }

            setError(null);
            onChange([...files, ...next]);
        },
        [allowedExtensions, files, maxFileSizeKb, onChange],
    );

    return (
        <div>
            <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    addFiles(event.dataTransfer.files);
                }}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-primary"
            >
                <UploadCloud className="h-10 w-10 text-primary" />
                <span className="mt-3 text-sm font-medium text-slate-900">Drag & drop attachment atau klik untuk memilih</span>
                <span className="mt-1 text-xs text-slate-500">{allowedExtensions.join(', ').toUpperCase()} maksimal {Math.round(maxFileSizeKb / 1024)} MB per file</span>
                <input type="file" multiple className="hidden" onChange={(event) => event.target.files && addFiles(event.target.files)} />
            </label>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            {files.length ? (
                <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                            <span className="truncate">{file.name}</span>
                            <Button type="button" variant="ghost" className="h-8 px-2" onClick={() => onChange(files.filter((_, fileIndex) => fileIndex !== index))}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
