<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\UserMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserMapping>
 */
class UserMappingFactory extends Factory
{
    protected $model = UserMapping::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fake()->unique()->userName(),
            'name' => fake()->name(),
            'department_id' => Department::factory(),
            'role' => UserRole::User,
            'active' => true,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (): array => ['role' => UserRole::Admin]);
    }

    public function viewer(): static
    {
        return $this->state(fn (): array => ['role' => UserRole::Viewer]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => ['active' => false]);
    }
}
