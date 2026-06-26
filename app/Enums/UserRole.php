<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'Admin';
    case User = 'User';

    public function isAdmin(): bool
    {
        return $this === self::Admin;
    }
}
