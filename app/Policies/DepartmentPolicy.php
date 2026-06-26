<?php

namespace App\Policies;

use App\Data\CurrentUserData;
use App\Models\Department;

class DepartmentPolicy
{
    public function viewAny(CurrentUserData $user): bool
    {
        return $user->isAdmin();
    }

    public function create(CurrentUserData $user): bool
    {
        return $user->isAdmin();
    }

    public function update(CurrentUserData $user, Department $department): bool
    {
        return $user->isAdmin();
    }

    public function delete(CurrentUserData $user, Department $department): bool
    {
        return $user->isAdmin();
    }
}
