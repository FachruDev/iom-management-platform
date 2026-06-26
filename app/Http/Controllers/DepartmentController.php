<?php

namespace App\Http\Controllers;

use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Http\Requests\MasterData\DepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Repositories\DepartmentRepository;
use App\Services\ActivityLogService;
use App\Services\CurrentUserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
        private readonly DepartmentRepository $departmentRepository,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('viewAny', Department::class);

        return Inertia::render('admin/departments/index', [
            'departments' => DepartmentResource::collection($this->departmentRepository->paginate($request->string('search')->toString() ?: null)),
            'filters' => ['search' => $request->string('search')->toString()],
        ]);
    }

    public function store(DepartmentRequest $request): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('create', Department::class);

        $department = Department::create($request->validated());
        $this->activityLogService->record(ActivityModule::Department, ActivityType::Create, $department, newValues: $department->toArray(), user: $user);

        return back()->with('success', 'Department berhasil dibuat.');
    }

    public function update(DepartmentRequest $request, Department $department): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('update', $department);

        $oldValues = $department->toArray();
        $department->update($request->validated());
        $this->activityLogService->record(ActivityModule::Department, ActivityType::Update, $department, $oldValues, $department->fresh()?->toArray() ?? [], user: $user);

        return back()->with('success', 'Department berhasil diperbarui.');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('delete', $department);

        $oldValues = $department->toArray();
        $department->delete();
        $this->activityLogService->record(ActivityModule::Department, ActivityType::Delete, $department, oldValues: $oldValues, user: $user);

        return back()->with('success', 'Department berhasil dihapus.');
    }
}
