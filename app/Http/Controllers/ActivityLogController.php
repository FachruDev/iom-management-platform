<?php

namespace App\Http\Controllers;

use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Http\Requests\ActivityLogIndexRequest;
use App\Http\Resources\ActivityLogResource;
use App\Repositories\ActivityLogRepository;
use App\Services\CurrentUserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
        private readonly ActivityLogRepository $activityLogRepository,
    ) {}

    public function index(ActivityLogIndexRequest $request): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('viewAny', Activity::class);

        return Inertia::render('admin/activity-log/index', [
            'activities' => ActivityLogResource::collection($this->activityLogRepository->paginate($request->validated())),
            'latestActivities' => ActivityLogResource::collection(Activity::latest()->limit(10)->get()),
            'todayCount' => Activity::whereDate('created_at', now()->toDateString())->count(),
            'activeUsers' => Activity::query()
                ->select('properties->user_id as user_id', 'properties->user_name as user_name', DB::raw('count(*) as total'))
                ->whereNotNull('properties->user_id')
                ->groupBy('user_id', 'user_name')
                ->orderByDesc('total')
                ->limit(10)
                ->get(),
            'modules' => array_map(fn (ActivityModule $module): string => $module->value, ActivityModule::cases()),
            'activityTypes' => array_map(fn (ActivityType $type): string => $type->value, ActivityType::cases()),
            'filters' => $request->validated(),
        ]);
    }

    public function show(Activity $activity): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('view', $activity);

        return Inertia::render('admin/activity-log/show', [
            'activity' => ActivityLogResource::make($activity),
        ]);
    }
}
