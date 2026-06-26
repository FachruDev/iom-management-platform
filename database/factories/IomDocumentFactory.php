<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\IomDocument;
use App\Models\UserMapping;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IomDocument>
 */
class IomDocumentFactory extends Factory
{
    protected $model = IomDocument::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'iom_number' => 'IOM-'.fake()->unique()->numerify('#####'),
            'effective_date' => now()->toDateString(),
            'department_id' => Department::factory(),
            'uploaded_by_id' => UserMapping::factory(),
            'description' => fake()->paragraph(),
        ];
    }
}
