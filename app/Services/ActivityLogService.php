<?php

namespace App\Services;

use App\Data\CurrentUserData;
use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogService
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
    ) {}

    /**
     * @param  array<string, mixed>  $oldValues
     * @param  array<string, mixed>  $newValues
     * @param  array<string, mixed>  $extra
     */
    public function record(
        ActivityModule $module,
        ActivityType $type,
        ?Model $subject = null,
        array $oldValues = [],
        array $newValues = [],
        array $extra = [],
        ?Request $request = null,
        ?CurrentUserData $user = null,
    ): void {
        $request ??= request();
        $user ??= $this->currentUserService->get();

        activity($module->value)
            ->event($type->value)
            ->withProperties([
                'user_id' => $user?->userId,
                'user_name' => $user?->name,
                'department' => $user?->departmentName,
                'module' => $module->value,
                'activity' => $type->value,
                'model' => $subject ? $subject::class : null,
                'record_id' => $subject?->getKey(),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                ...$extra,
            ])
            ->log($type->value);
    }
}
