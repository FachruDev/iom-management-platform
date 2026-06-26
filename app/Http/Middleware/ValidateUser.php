<?php

namespace App\Http\Middleware;

use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Services\ActivityLogService;
use App\Services\CurrentUserService;
use App\Services\UserValidationService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateUser
{
    public function __construct(
        private readonly UserValidationService $userValidationService,
        private readonly CurrentUserService $currentUserService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userId = $request->query('user_id');
        $currentUser = $this->userValidationService->validate(is_string($userId) ? $userId : null);

        if ($currentUser === null) {
            $this->activityLogService->record(
                ActivityModule::Authentication,
                ActivityType::Unauthorized,
                request: $request,
            );

            abort(401, 'Unauthorized.');
        }

        $this->currentUserService->set($currentUser);
        $this->activityLogService->record(
            ActivityModule::Authentication,
            ActivityType::Validated,
            request: $request,
            user: $currentUser,
        );

        return $next($request);
    }
}
