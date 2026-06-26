<?php

namespace App\Http\Controllers;

use App\Enums\ActivityModule;
use App\Enums\ActivityType;
use App\Http\Requests\Documents\DocumentIndexRequest;
use App\Http\Requests\Documents\StoreDocumentRequest;
use App\Http\Requests\Documents\UpdateDocumentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\IomDocumentResource;
use App\Models\IomDocument;
use App\Models\IomDocumentFile;
use App\Repositories\DepartmentRepository;
use App\Repositories\DocumentRepository;
use App\Services\ActivityLogService;
use App\Services\CurrentUserService;
use App\Services\DocumentService;
use App\Services\FileStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function __construct(
        private readonly CurrentUserService $currentUserService,
        private readonly DocumentRepository $documentRepository,
        private readonly DepartmentRepository $departmentRepository,
        private readonly DocumentService $documentService,
        private readonly FileStorageService $fileStorageService,
        private readonly ActivityLogService $activityLogService,
    ) {}

    public function index(DocumentIndexRequest $request): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('viewAny', IomDocument::class);

        $documents = $this->documentRepository->paginate(
            $user,
            $request->validated('search'),
            $request->integer('department_id') ?: null,
            $request->validated('extension'),
        );

        return Inertia::render('documents/index', [
            'documents' => IomDocumentResource::collection($documents),
            'departments' => DepartmentResource::collection($this->departmentRepository->options()),
            'filters' => $request->validated(),
        ]);
    }

    public function create(): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('create', IomDocument::class);

        return Inertia::render('documents/form', [
            'mode' => 'create',
            'document' => null,
            'departments' => DepartmentResource::collection($this->departmentRepository->options()),
        ]);
    }

    public function store(StoreDocumentRequest $request): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('create', IomDocument::class);

        $this->documentService->create($request->validated(), $request->file('files', []), $user);

        return to_route('documents.index', ['user_id' => $user->userId])->with('success', 'Dokumen berhasil diupload.');
    }

    public function show(IomDocument $document): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('view', $document);

        return Inertia::render('documents/show', [
            'document' => IomDocumentResource::make($document->load(['department', 'uploader', 'files'])),
        ]);
    }

    public function edit(IomDocument $document): Response
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('update', $document);

        return Inertia::render('documents/form', [
            'mode' => 'edit',
            'document' => IomDocumentResource::make($document->load(['department', 'uploader', 'files'])),
            'departments' => DepartmentResource::collection($this->departmentRepository->options()),
        ]);
    }

    public function update(UpdateDocumentRequest $request, IomDocument $document): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('update', $document);

        $this->documentService->update($document, $request->validated(), $request->file('files', []), $user);

        return to_route('documents.show', ['document' => $document, 'user_id' => $user->userId])->with('success', 'Dokumen berhasil diperbarui.');
    }

    public function destroy(IomDocument $document): RedirectResponse
    {
        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('delete', $document);

        $this->documentService->delete($document, $user);

        return to_route('documents.index', ['user_id' => $user->userId])->with('success', 'Dokumen berhasil dihapus.');
    }

    public function download(IomDocument $document, IomDocumentFile $file): StreamedResponse
    {
        abort_if($file->iom_document_id !== $document->id, 404);

        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('download', $document);

        $this->activityLogService->record(ActivityModule::Document, ActivityType::Download, $file, user: $user);

        return $this->fileStorageService->download($file);
    }

    public function preview(IomDocument $document, IomDocumentFile $file): StreamedResponse
    {
        abort_if($file->iom_document_id !== $document->id, 404);

        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('preview', $document);

        return $this->fileStorageService->preview($file);
    }

    public function destroyFile(IomDocument $document, IomDocumentFile $file): RedirectResponse
    {
        abort_if($file->iom_document_id !== $document->id, 404);

        $user = $this->currentUserService->require();
        Gate::forUser($user)->authorize('update', $document);

        $this->documentService->deleteFile($file, $user);

        return back()->with('success', 'Attachment berhasil dihapus.');
    }
}
