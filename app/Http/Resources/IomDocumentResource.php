<?php

namespace App\Http\Resources;

use App\Services\CurrentUserService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class IomDocumentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentUser = app(CurrentUserService::class)->get();

        return [
            'id' => $this->id,
            'iom_number' => $this->iom_number,
            'effective_date' => $this->effective_date?->toDateString(),
            'description' => $this->description,
            'department_id' => $this->department_id,
            'department' => $this->whenLoaded('department', fn () => [
                'id' => $this->department?->id,
                'name' => $this->department?->name,
            ]),
            'uploader' => $this->whenLoaded('uploader', fn () => [
                'id' => $this->uploader?->id,
                'user_id' => $this->uploader?->user_id,
                'name' => $this->uploader?->name,
            ]),
            'files' => IomDocumentFileResource::collection($this->whenLoaded('files')),
            'files_count' => $this->whenCounted('files'),
            'can' => [
                'view' => $currentUser !== null && Gate::forUser($currentUser)->allows('view', $this->resource),
                'edit' => $currentUser !== null && Gate::forUser($currentUser)->allows('update', $this->resource),
                'delete' => $currentUser !== null && Gate::forUser($currentUser)->allows('delete', $this->resource),
                'download' => $currentUser !== null && Gate::forUser($currentUser)->allows('download', $this->resource),
                'preview' => $currentUser !== null && Gate::forUser($currentUser)->allows('preview', $this->resource),
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
