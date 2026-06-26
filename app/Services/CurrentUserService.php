<?php

namespace App\Services;

use App\Data\CurrentUserData;
use App\Models\UserMapping;

class CurrentUserService
{
    private ?CurrentUserData $user = null;

    public function set(CurrentUserData $user): void
    {
        $this->user = $user;
    }

    public function get(): ?CurrentUserData
    {
        return $this->user;
    }

    public function require(): CurrentUserData
    {
        abort_if($this->user === null, 401, 'Unauthorized.');

        return $this->user;
    }

    public function fromMapping(UserMapping $mapping): CurrentUserData
    {
        $mapping->loadMissing('department');

        return new CurrentUserData(
            mappingId: $mapping->id,
            userId: $mapping->user_id,
            name: $mapping->name,
            departmentId: $mapping->department_id,
            departmentName: $mapping->department?->name ?? '-',
            role: $mapping->role,
        );
    }
}
