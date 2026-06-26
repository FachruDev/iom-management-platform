<?php

namespace App\Services;

use App\Data\CurrentUserData;
use App\Models\UserMapping;

class UserValidationService
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
    ) {}

    public function validate(?string $userId): ?CurrentUserData
    {
        if ($userId === null || trim($userId) === '') {
            return null;
        }

        $mapping = UserMapping::query()
            ->with('department')
            ->where('user_id', $userId)
            ->where('active', true)
            ->first();

        if (! $mapping instanceof UserMapping) {
            return null;
        }

        return $this->currentUserService->fromMapping($mapping);
    }
}
