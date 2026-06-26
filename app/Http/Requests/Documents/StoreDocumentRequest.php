<?php

namespace App\Http\Requests\Documents;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
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
        return [
            'iom_number' => ['nullable', 'string', 'max:100', Rule::unique('iom_documents', 'iom_number')],
            'effective_date' => ['nullable', 'date'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'description' => ['required', 'string', 'max:5000'],
            'files' => ['required', 'array', 'min:1'],
            'files.*' => [
                'required',
                'file',
                'max:'.config('iom.uploads.max_file_size_kb'),
                'mimes:'.implode(',', config('iom.uploads.allowed_extensions')),
                'mimetypes:'.implode(',', config('iom.uploads.allowed_mime_types')),
            ],
        ];
    }
}
