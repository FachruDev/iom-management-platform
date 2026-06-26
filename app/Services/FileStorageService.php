<?php

namespace App\Services;

use App\Models\IomDocument;
use App\Models\IomDocumentFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileStorageService
{
    public function store(IomDocument $document, UploadedFile $file): IomDocumentFile
    {
        $disk = (string) config('iom.storage.disk');
        $basePath = trim((string) config('iom.storage.path'), '/');
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = Str::ulid()->toBase32().'.'.$extension;
        $path = $file->storeAs($basePath.'/'.$document->id, $filename, $disk);

        return $document->files()->create([
            'disk' => $disk,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'extension' => $extension,
            'size' => $file->getSize() ?: 0,
        ]);
    }

    public function delete(IomDocumentFile $file): void
    {
        Storage::disk($file->disk)->delete($file->path);
        $file->delete();
    }

    public function download(IomDocumentFile $file): StreamedResponse
    {
        return Storage::disk($file->disk)->download($file->path, $file->original_name);
    }

    public function preview(IomDocumentFile $file): StreamedResponse
    {
        return Storage::disk($file->disk)->response(
            $file->path,
            $file->original_name,
            ['Content-Type' => $file->mime_type],
            'inline',
        );
    }
}
