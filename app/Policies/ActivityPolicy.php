<?php

namespace App\Policies;

use App\Data\CurrentUserData;
use Spatie\Activitylog\Models\Activity;

class ActivityPolicy
{
    public function viewAny(CurrentUserData $user): bool
    {
        return $user->isAdmin();
    }

    public function view(CurrentUserData $user, Activity $activity): bool
    {
        return $user->isAdmin();
    }
}
