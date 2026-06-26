<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\IomDocument;
use App\Models\IomDocumentFile;
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

        $document = IomDocument::where('iom_number', 'IOM-001')->firstOrFail();

        $this->assertSame(now()->toDateString(), $document->effective_date?->toDateString());
        $this->assertDatabaseCount('iom_document_files', 2);
        $this->assertDatabaseHas('activity_log', [
            'event' => 'Upload',
            'subject_id' => null,
            'subject_type' => null,
        ]);
    }

    public function test_user_can_view_other_users_document_but_cannot_manage_it(): void
    {
        Storage::fake('local');
        $department = Department::factory()->create();
        $owner = UserMapping::factory()->create(['department_id' => $department->id, 'user_id' => 'Owner']);
        UserMapping::factory()->create(['department_id' => $department->id, 'user_id' => 'Other']);
        $document = IomDocument::factory()->create([
            'department_id' => $department->id,
            'uploaded_by_id' => $owner->id,
        ]);

        Storage::disk('local')->put("iom/{$document->id}/memo.pdf", 'PDF content');

        $file = IomDocumentFile::factory()->create([
            'iom_document_id' => $document->id,
            'disk' => 'local',
            'path' => "iom/{$document->id}/memo.pdf",
            'original_name' => 'memo.pdf',
            'mime_type' => 'application/pdf',
            'extension' => 'pdf',
        ]);

        $this->get("/documents/{$document->id}?user_id=Other")->assertOk();
        $this->get("/documents/{$document->id}/edit?user_id=Other")->assertForbidden();
        $this->delete("/documents/{$document->id}?user_id=Other")->assertForbidden();
        $this->get("/documents/{$document->id}/files/{$file->id}/download?user_id=Other")->assertForbidden();
        $this->get("/documents/{$document->id}/files/{$file->id}/preview?user_id=Other")->assertOk();
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

    public function test_user_can_preview_own_document_file(): void
    {
        Storage::fake('local');
        $department = Department::factory()->create();
        $owner = UserMapping::factory()->create(['department_id' => $department->id, 'user_id' => 'Owner']);
        $document = IomDocument::factory()->create([
            'department_id' => $department->id,
            'uploaded_by_id' => $owner->id,
        ]);

        Storage::disk('local')->put("iom/{$document->id}/memo.pdf", 'PDF content');

        $file = IomDocumentFile::factory()->create([
            'iom_document_id' => $document->id,
            'disk' => 'local',
            'path' => "iom/{$document->id}/memo.pdf",
            'original_name' => 'memo.pdf',
            'mime_type' => 'application/pdf',
            'extension' => 'pdf',
        ]);

        $this->get("/documents/{$document->id}/files/{$file->id}/preview?user_id=Owner")
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    }

    public function test_viewer_role_can_only_view_and_preview_documents(): void
    {
        Storage::fake('local');
        $department = Department::factory()->create();
        $owner = UserMapping::factory()->create(['department_id' => $department->id, 'user_id' => 'Owner']);
        UserMapping::factory()->viewer()->create(['department_id' => $department->id, 'user_id' => 'ViewerUser']);
        $document = IomDocument::factory()->create([
            'department_id' => $department->id,
            'uploaded_by_id' => $owner->id,
        ]);

        Storage::disk('local')->put("iom/{$document->id}/memo.pdf", 'PDF content');

        $file = IomDocumentFile::factory()->create([
            'iom_document_id' => $document->id,
            'disk' => 'local',
            'path' => "iom/{$document->id}/memo.pdf",
            'original_name' => 'memo.pdf',
            'mime_type' => 'application/pdf',
            'extension' => 'pdf',
        ]);

        $this->get('/documents?user_id=ViewerUser')->assertOk();
        $this->get("/documents/{$document->id}?user_id=ViewerUser")->assertOk();
        $this->get("/documents/{$document->id}/files/{$file->id}/preview?user_id=ViewerUser")->assertOk();
        $this->get('/documents/create?user_id=ViewerUser')->assertForbidden();
        $this->get("/documents/{$document->id}/edit?user_id=ViewerUser")->assertForbidden();
        $this->delete("/documents/{$document->id}?user_id=ViewerUser")->assertForbidden();
        $this->get("/documents/{$document->id}/files/{$file->id}/download?user_id=ViewerUser")->assertForbidden();
    }
}
