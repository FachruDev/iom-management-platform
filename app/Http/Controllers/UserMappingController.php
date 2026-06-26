<?php

namespace App\Http\Controllers;

use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Enums\UserRole;
use App\Http\Requests\MasterData\UserMappingRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\UserMappingResource;
use App\Models\UserMapping;
use App\Repositories\DepartmentRepository;
use App\Repositories\UserMappingRepository;
use App\Services\ActivityLogService;
use App\Services\CurrentUserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserMappingController extends Controller
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
        private readonly UserMappingRepository $userMappingRepository,
        private readonly DepartmentRepository $departmentRepository,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('viewAny', UserMapping::class);

        return Inertia::render('admin/user-mappings/index', [
            'userMappings' => UserMappingResource::collection($this->userMappingRepository->paginate(
                $request->string('search')->toString() ?: null,
                $request->string('role')->toString() ?: null,
                $request->query('active') !== null ? (string) $request->query('active') : null,
            )),
            'departments' => DepartmentResource::collection($this->departmentRepository->options()),
            'roles' => array_map(fn (UserRole $role): string => $role->value, UserRole::cases()),
            'filters' => $request->only(['search', 'role', 'active']),
        ]);
    }

    public function store(UserMappingRequest $request): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('create', UserMapping::class);

        $mapping = UserMapping::create($request->validated());
        $this->activityLogService->record(ActivityModule::UserMapping, ActivityType::Create, $mapping, newValues: $mapping->toArray(), user: $user);

        return back()->with('success', 'User mapping berhasil dibuat.');
    }

    public function update(UserMappingRequest $request, UserMapping $userMapping): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('update', $userMapping);

        $oldValues = $userMapping->toArray();
        $userMapping->update($request->validated());
        $this->activityLogService->record(ActivityModule::UserMapping, ActivityType::Update, $userMapping, $oldValues, $userMapping->fresh()?->toArray() ?? [], user: $user);

        return back()->with('success', 'User mapping berhasil diperbarui.');
    }

    public function destroy(UserMapping $userMapping): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('delete', $userMapping);

        $oldValues = $userMapping->toArray();
        $userMapping->delete();
        $this->activityLogService->record(ActivityModule::UserMapping, ActivityType::Delete, $userMapping, oldValues: $oldValues, user: $user);

        return back()->with('success', 'User mapping berhasil dihapus.');
    }
}
