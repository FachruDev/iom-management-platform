<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'Admin';
    case User = 'User';
    case Viewer = 'Viewer';

    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }

    public function canManageOwnDocuments(): bool
    {
        return $this === self::Admin || $this === self::User;
    }

    public function isViewer(): bool
    {
        return $this === self::Viewer;
    }
}
