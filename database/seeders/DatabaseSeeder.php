<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\UserMapping;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $management = Department::firstOrCreate(
            ['name' => 'Management'],
            ['description' => 'Default management department.'],
        );

        $finance = Department::firstOrCreate(
            ['name' => 'Finance'],
            ['description' => 'Finance and accounting department.'],
        );

        $operations = Department::firstOrCreate(
            ['name' => 'Operations'],
            ['description' => 'Operations department.'],
        );

        UserMapping::updateOrCreate(
            ['user_id' => 'Superadmin'],
            [
                'name' => 'Super Admin',
                'department_id' => $management->id,
                'role' => UserRole::Admin,
                'active' => true,
            ],
        );

        UserMapping::updateOrCreate(
            ['user_id' => 'UserDemo'],
            [
                'name' => 'User Demo',
                'department_id' => $operations->id,
                'role' => UserRole::User,
                'active' => true,
            ],
        );

        UserMapping::updateOrCreate(
            ['user_id' => 'FinanceUser'],
            [
                'name' => 'Finance User',
                'department_id' => $finance->id,
                'role' => UserRole::User,
                'active' => true,
            ],
        );

        UserMapping::updateOrCreate(
            ['user_id' => 'ViewerUser'],
            [
                'name' => 'Viewer User',
                'department_id' => $operations->id,
                'role' => UserRole::Viewer,
                'active' => true,
            ],
        );
    }
}
