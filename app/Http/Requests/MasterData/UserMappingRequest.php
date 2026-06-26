<?php

namespace App\Http\Requests\MasterData;

use App\Enums\UserRole;
use App\Models\UserMapping;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserMappingRequest extends FormRequest
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
        $mapping = $this->route('user_mapping');
        $mappingId = $mapping instanceof UserMapping ? $mapping->id : null;

        return [
            'user_id' => ['required', 'string', 'max:100', Rule::unique('user_mappings', 'user_id')->ignore($mappingId)],
            'name' => ['required', 'string', 'max:150'],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'role' => ['required', Rule::enum(UserRole::class)],
            'active' => ['required', 'boolean'],
        ];
    }
}
