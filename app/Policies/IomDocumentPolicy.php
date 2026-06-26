<?php

namespace App\Policies;

use App\Data\CurrentUserData;
use App\Models\IomDocument;

class IomDocumentPolicy
{
    public function viewAny(CurrentUserData $user): bool
    {
        return true;
    }

    public function view(CurrentUserData $user, IomDocument $document): bool
    {
        return $user->isAdmin() || $document->uploaded_by_id === $user->mappingId;
    }

    public function create(CurrentUserData $user): bool
    {
        return true;
    }

    public function update(CurrentUserData $user, IomDocument $document): bool
    {
        return $this->view($user, $document);
    }

    public function delete(CurrentUserData $user, IomDocument $document): bool
    {
        return $this->view($user, $document);
    }

    public function download(CurrentUserData $user, IomDocument $document): bool
    {
        return $this->view($user, $document);
    }
}
