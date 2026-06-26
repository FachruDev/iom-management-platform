<?php

namespace App\Http\Middleware;

use App\Models\IomDocument;
use App\Services\CurrentUserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
    ) {}

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $currentUser = $this->currentUserService->get();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'currentUser' => fn () => $currentUser?->toSharedArray(),
            'iomConfig' => [
                'maxFileSizeKb' => config('iom.uploads.max_file_size_kb'),
                'allowedExtensions' => config('iom.uploads.allowed_extensions'),
            ],
            'permissions' => [
                'isAdmin' => fn () => $currentUser?->isAdmin() ?? false,
                'canCreateDocuments' => fn () => $currentUser !== null && Gate::forUser($currentUser)->allows('create', IomDocument::class),
            ],
        ];
    }
}
