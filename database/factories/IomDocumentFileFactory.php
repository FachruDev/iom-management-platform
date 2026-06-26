<?php

namespace Database\Factories;

use App\Models\IomDocument;
use App\Models\IomDocumentFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<IomDocumentFile>
 */
class IomDocumentFileFactory extends Factory
{
    protected $model = IomDocumentFile::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'iom_document_id' => IomDocument::factory(),
            'disk' => 'local',
            'path' => 'iom/'.fake()->uuid().'.pdf',
            'original_name' => fake()->word().'.pdf',
            'mime_type' => 'application/pdf',
            'extension' => 'pdf',
            'size' => 1024,
        ];
    }
}
