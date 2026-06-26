<?php

namespace App\Repositories;

use App\Data\CurrentUserData;
use App\Models\IomDocument;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DocumentRepository
{
    /**
     * @return LengthAwarePaginator<int, IomDocument>
     */
    public function paginate(CurrentUserData $user, ?string $search = null, ?int $departmentId = null, ?string $extension = null): LengthAwarePaginator
    {
        return IomDocument::query()
            ->with(['department', 'uploader', 'files'])
            ->withCount('files')
            ->when(! $user->isAdmin(), fn ($query) => $query->where('uploaded_by_id', $user->mappingId))
            ->when($departmentId, fn ($query) => $query->where('department_id', $departmentId))
            ->when($extension, fn ($query) => $query->whereHas('files', fn ($files) => $files->where('extension', $extension)))
            ->when($search, fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('iom_number', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('department', fn ($department) => $department->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('uploader', fn ($uploader) => $uploader->where('name', 'like', "%{$search}%")->orWhere('user_id', 'like', "%{$search}%"))
                    ->orWhereHas('files', fn ($files) => $files->where('original_name', 'like', "%{$search}%"));
            }))
            ->latest()
            ->paginate((int) config('iom.pagination.per_page'))
            ->withQueryString();
    }
}
