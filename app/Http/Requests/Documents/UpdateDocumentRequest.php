<?php

namespace App\Http\Requests\Documents;

use App\Models\IomDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $document = $this->route('document');
        $documentId = $document instanceof IomDocument ? $document->id : null;

        return [
            'iom_number' => ['nullable', 'string', 'max:100', Rule::unique('iom_documents', 'iom_number')->ignore($documentId)],
            'effective_date' => ['nullable', 'date'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'description' => ['required', 'string', 'max:5000'],
            'files' => ['nullable', 'array'],
            'files.*' => [
                'file',
                'max:'.config('iom.uploads.max_file_size_kb'),
                'mimes:'.implode(',', config('iom.uploads.allowed_extensions')),
                'mimetypes:'.implode(',', config('iom.uploads.allowed_mime_types')),
            ],
        ];
    }
}
