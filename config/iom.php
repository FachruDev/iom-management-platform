<?php

return [
    'storage' => [
        'disk' => env('IOM_STORAGE_DISK', 'local'),
        'path' => env('IOM_STORAGE_PATH', 'iom'),
    ],

    'uploads' => [
        'max_file_size_kb' => (int) env('IOM_MAX_FILE_SIZE_KB', 20480),
        'allowed_extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'],
        'allowed_mime_types' => [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
        ],
    ],

    'pagination' => [
        'per_page' => (int) env('IOM_PER_PAGE', 10),
    ],
];
