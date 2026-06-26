<?php

namespace App\Data;

use App\Enums\UserRole;
use Spatie\LaravelData\Data;

class CurrentUserData extends Data
{
    public function __construct(
        public readonly int $mappingId,
        public readonly string $userId,
        public readonly string $name,
        public readonly int $departmentId,
        public readonly string $departmentName,
        public readonly UserRole $role,
    ) {}

    public function isAdmin(): bool
    {
        return $this->role->isAdmin();
    }

    public function canManageOwnDocuments(): bool
    {
        return $this->role->canManageOwnDocuments();
    }

    public function isViewer(): bool
    {
        return $this->role->isViewer();
    }

    /**
     * @return array<string, mixed>
     */
    public function toSharedArray(): array
    {
        return [
            'mapping_id' => $this->mappingId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'department' => [
                'id' => $this->departmentId,
                'name' => $this->departmentName,
            ],
            'role' => $this->role->value,
            'is_admin' => $this->isAdmin(),
            'is_viewer' => $this->isViewer(),
        ];
    }
}
