<?php

namespace App\Repositories;

use App\Models\UserMapping;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserMappingRepository
{
    /**
     * @return LengthAwarePaginator<int, UserMapping>
     */
    public function paginate(?string $search = null, ?string $role = null, ?string $active = null): LengthAwarePaginator
    {
        return UserMapping::query()
            ->with('department')
            ->when($search, fn ($query) => $query->where(function ($query) use ($search): void {
                $query->where('user_id', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhereHas('department', fn ($department) => $department->where('name', 'like', "%{$search}%"));
            }))
            ->when($role, fn ($query) => $query->where('role', $role))
            ->when($active !== null && $active !== '', fn ($query) => $query->where('active', $active === '1'))
            ->latest()
            ->paginate((int) config('iom.pagination.per_page'))
            ->withQueryString();
    }
}
