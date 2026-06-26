<?php

namespace App\Repositories;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Activitylog\Models\Activity;

class ActivityLogRepository
{
    /**
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator<int, Activity>
     */
    public function paginate(array $filters): LengthAwarePaginator
    {
        return Activity::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search): void {
                $query->where('description', 'like', "%{$search}%")
                    ->orWhere('event', 'like', "%{$search}%")
                    ->orWhere('log_name', 'like', "%{$search}%")
                    ->orWhere('properties->user_id', 'like', "%{$search}%")
                    ->orWhere('properties->user_name', 'like', "%{$search}%");
            }))
            ->when($filters['user'] ?? null, fn ($query, $user) => $query->where('properties->user_id', $user))
            ->when($filters['module'] ?? null, fn ($query, $module) => $query->where('properties->module', $module))
            ->when($filters['activity'] ?? null, fn ($query, $activity) => $query->where('event', $activity))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '<=', $date))
            ->latest()
            ->paginate((int) config('iom.pagination.per_page'))
            ->withQueryString();
    }
}
