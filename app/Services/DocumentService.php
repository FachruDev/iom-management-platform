<?php

namespace App\Services;

use App\Data\CurrentUserData;
use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Models\IomDocument;
use App\Models\IomDocumentFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class DocumentService
{
    public function __construct(
        private readonly FileStorageService $fileStorageService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, UploadedFile>  $files
     */
    public function create(array $data, array $files, CurrentUserData $user): IomDocument
    {
        return DB::transaction(function () use ($data, $files, $user): IomDocument {
            $document = IomDocument::create([
                'iom_number' => $data['iom_number'] ?? null,
                'department_id' => $data['department_id'],
                'uploaded_by_id' => $user->mappingId,
                'description' => $data['description'],
            ]);

            foreach ($files as $file) {
                $storedFile = $this->fileStorageService->store($document, $file);
                $this->activityLogService->record(ActivityModule::Document, ActivityType::UploadAttachment, $storedFile, newValues: $storedFile->toArray(), user: $user);
            }

            $this->activityLogService->record(ActivityModule::Document, ActivityType::Upload, $document, newValues: $document->toArray(), user: $user);

            return $document->load(['department', 'uploader', 'files']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, UploadedFile>  $files
     */
    public function update(IomDocument $document, array $data, array $files, CurrentUserData $user): IomDocument
    {
        return DB::transaction(function () use ($document, $data, $files, $user): IomDocument {
            $oldValues = $document->only(['iom_number', 'department_id', 'description']);

            $document->update([
                'iom_number' => $data['iom_number'] ?? null,
                'department_id' => $data['department_id'],
                'description' => $data['description'],
            ]);

            foreach ($files as $file) {
                $storedFile = $this->fileStorageService->store($document, $file);
                $this->activityLogService->record(ActivityModule::Document, ActivityType::UploadAttachment, $storedFile, newValues: $storedFile->toArray(), user: $user);
            }

            $this->activityLogService->record(ActivityModule::Document, ActivityType::Update, $document, $oldValues, $document->fresh()?->toArray() ?? [], user: $user);

            return $document->load(['department', 'uploader', 'files']);
        });
    }

    public function delete(IomDocument $document, CurrentUserData $user): void
    {
        DB::transaction(function () use ($document, $user): void {
            $oldValues = $document->load('files')->toArray();

            foreach ($document->files as $file) {
                $this->fileStorageService->delete($file);
                $this->activityLogService->record(ActivityModule::Document, ActivityType::DeleteAttachment, $file, oldValues: $file->toArray(), user: $user);
            }

            $document->delete();
            $this->activityLogService->record(ActivityModule::Document, ActivityType::Delete, $document, oldValues: $oldValues, user: $user);
        });
    }

    public function deleteFile(IomDocumentFile $file, CurrentUserData $user): void
    {
        DB::transaction(function () use ($file, $user): void {
            $oldValues = $file->toArray();
            $this->fileStorageService->delete($file);
            $this->activityLogService->record(ActivityModule::Document, ActivityType::DeleteAttachment, $file, oldValues: $oldValues, user: $user);
        });
    }
}
