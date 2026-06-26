<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\UserMapping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IomAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_missing_user_id_returns_unauthorized(): void
    {
        $this->get('/dashboard')->assertUnauthorized();
    }

    public function test_active_user_mapping_can_access_dashboard(): void
    {
        $department = Department::factory()->create();
        UserMapping::factory()->admin()->create([
            'user_id' => 'Superadmin',
            'department_id' => $department->id,
        ]);

        $this->get('/dashboard?user_id=Superadmin')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('dashboard/admin')
                ->where('currentUser.user_id', 'Superadmin')
                ->where('permissions.isAdmin', true)
                ->where('permissions.canCreateDocuments', true));
    }

    public function test_session_user_context_without_query_is_unauthorized(): void
    {
        $department = Department::factory()->create();
        UserMapping::factory()->admin()->create([
            'user_id' => 'Superadmin',
            'department_id' => $department->id,
        ]);

        $this->withSession(['egis_user_id' => 'Superadmin'])
            ->get('/dashboard')
            ->assertUnauthorized();
    }

    public function test_inactive_user_mapping_is_unauthorized(): void
    {
        $department = Department::factory()->create();
        UserMapping::factory()->create([
            'user_id' => 'InactiveUser',
            'department_id' => $department->id,
            'role' => UserRole::User,
            'active' => false,
        ]);

        $this->get('/dashboard?user_id=InactiveUser')->assertUnauthorized();
    }
}
