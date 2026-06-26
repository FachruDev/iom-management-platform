<?php

namespace App\Repositories;

use App\Models\Department;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class DepartmentRepository
{
    /**
     * @return LengthAwarePaginator<int, Department>
     */
    public function paginate(?string $search = null): LengthAwarePaginator
    {
        return Department::query()
            ->withCount(['documents', 'userMappings'])
            ->when($search, fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"))
            ->latest()
            ->paginate((int) config('iom.pagination.per_page'))
            ->withQueryString();
    }

    /**
     * @return Collection<int, Department>
     */
    public function options(): Collection
    {
        return Department::query()->orderBy('name')->get(['id', 'name']);
    }
}
