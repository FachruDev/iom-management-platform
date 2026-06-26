<?php

namespace App\Providers;

use App\Models\Department;
use App\Models\IomDocument;
use App\Models\UserMapping;
use App\Policies\ActivityPolicy;
use App\Policies\DepartmentPolicy;
use App\Policies\IomDocumentPolicy;
use App\Policies\UserMappingPolicy;
use App\Services\CurrentUserService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Spatie\Activitylog\Models\Activity;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(CurrentUserService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);
        JsonResource::withoutWrapping();

        Gate::policy(Department::class, DepartmentPolicy::class);
        Gate::policy(UserMapping::class, UserMappingPolicy::class);
        Gate::policy(IomDocument::class, IomDocumentPolicy::class);
        Gate::policy(Activity::class, ActivityPolicy::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
