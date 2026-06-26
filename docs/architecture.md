# IOM Management System Architecture

## Scope

IOM Management System is a focused document management system for Internal Office Memo files. It supports upload, storage, search, management, download through controllers, and activity audit. It intentionally excludes approval, workflow, disposition, status, and notification behavior.

## ERD

```mermaid
erDiagram
    departments ||--o{ user_mappings : contains
    departments ||--o{ iom_documents : owns
    user_mappings ||--o{ iom_documents : uploads
    iom_documents ||--o{ iom_document_files : has
    activity_log }o--o| iom_documents : subject
    activity_log }o--o| departments : subject
    activity_log }o--o| user_mappings : subject

    departments {
        bigint id PK
        string name UK
        text description
        timestamp deleted_at
    }

    user_mappings {
        bigint id PK
        string user_id UK
        string name
        bigint department_id FK
        string role
        boolean active
        timestamp deleted_at
    }

    iom_documents {
        ulid id PK
        string iom_number UK
        bigint department_id FK
        bigint uploaded_by_id FK
        text description
        timestamp deleted_at
    }

    iom_document_files {
        ulid id PK
        ulid iom_document_id FK
        string disk
        string path
        string original_name
        string mime_type
        string extension
        bigint size
        timestamp deleted_at
    }
```

## Key Decisions

- EGIS authentication is represented by `ValidateUser`, `UserValidationService`, `CurrentUserService`, and `CurrentUserData`; Laravel Auth login is not used.
- `user_mappings` is local metadata only. It controls local role, department, and active access for the dummy EGIS implementation.
- IOM document and file primary keys are ULIDs for safer future integration.
- File storage is private under `storage/app/private/iom`; direct public URLs are not created.
- Activity audit uses `spatie/laravel-activitylog` with consistent properties for user, department, module, activity, model, record ID, old/new values, IP address, and user agent.
