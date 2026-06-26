<?php

namespace App\Http\Controllers;

use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\IomDocumentResource;
use App\Services\CurrentUserService;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
        private readonly DashboardService $dashboardService,
    ) {}

    public function __invoke(): Response
    {
        $user = $this->currentUserService->require();

        if ($user->isAdmin()) {
            $dashboard = $this->dashboardService->admin();

            return Inertia::render('dashboard/admin', [
                'stats' => $dashboard['stats'],
                'recentUploads' => IomDocumentResource::collection($dashboard['recent_uploads']),
                'recentActivities' => ActivityLogResource::collection($dashboard['recent_activities']),
                'activeUsers' => $dashboard['active_users'],
            ]);
        }

        $dashboard = $this->dashboardService->user($user);

        return Inertia::render('dashboard/user', [
            'stats' => $dashboard['stats'],
            'recentUploads' => IomDocumentResource::collection($dashboard['recent_uploads']),
        ]);
    }
}
