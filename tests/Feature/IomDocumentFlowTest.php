<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\IomDocument;
use App\Models\UserMapping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class IomDocumentFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_user_can_upload_document_with_multiple_attachments(): void
    {
        Storage::fake('local');
        $department = Department::factory()->create();
        UserMapping::factory()->create([
            'user_id' => 'UserDemo',
            'department_id' => $department->id,
        ]);

        $this->post('/documents?user_id=UserDemo', [
            'iom_number' => 'IOM-001',
            'department_id' => $department->id,
            'description' => 'Memo internal.',
            'files' => [
                UploadedFile::fake()->create('memo.pdf', 128, 'application/pdf'),
                UploadedFile::fake()->create('lampiran.xlsx', 128, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
            ],
        ])->assertRedirect('/documents?user_id=UserDemo');

        $this->assertDatabaseHas('iom_documents', ['iom_number' => 'IOM-001']);
        $this->assertDatabaseCount('iom_document_files', 2);
        $this->assertDatabaseHas('activity_log', [
            'event' => 'Upload',
            'subject_id' => null,
            'subject_type' => null,
        ]);
    }

    public function test_user_cannot_view_other_users_document(): void
    {
        $department = Department::factory()->create();
        $owner = UserMapping::factory()->create(['department_id' => $department->id, 'user_id' => 'Owner']);
        UserMapping::factory()->create(['department_id' => $department->id, 'user_id' => 'Other']);
        $document = IomDocument::factory()->create([
            'department_id' => $department->id,
            'uploaded_by_id' => $owner->id,
        ]);

        $this->get("/documents/{$document->id}?user_id=Other")->assertForbidden();
    }

    public function test_admin_can_delete_any_document(): void
    {
        $department = Department::factory()->create();
        $owner = UserMapping::factory()->create(['department_id' => $department->id]);
        UserMapping::factory()->admin()->create(['department_id' => $department->id, 'user_id' => 'Superadmin']);
        $document = IomDocument::factory()->create([
            'department_id' => $department->id,
            'uploaded_by_id' => $owner->id,
        ]);

        $this->delete("/documents/{$document->id}?user_id=Superadmin")->assertRedirect('/documents?user_id=Superadmin');

        $this->assertSoftDeleted($document);
    }
}
