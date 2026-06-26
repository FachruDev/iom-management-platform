<?php

namespace App\Policies;

use App\Data\CurrentUserData;
use App\Models\UserMapping;

class UserMappingPolicy
{
    public function viewAny(CurrentUserData $user): bool
    {
        return $user->isAdmin();
    }

    public function create(CurrentUserData $user): bool
    {
        return $user->isAdmin();
    }

    public function update(CurrentUserData $user, UserMapping $userMapping): bool
    {
        return $user->isAdmin();
    }

    public function delete(CurrentUserData $user, UserMapping $userMapping): bool
    {
        return $user->isAdmin();
    }
}
