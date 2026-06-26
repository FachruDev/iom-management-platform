<?php

namespace App\Enums;

enum ActivityType: string
{
    case Validated = 'Validated';
    case Unauthorized = 'Unauthorized Access';
    case Forbidden = 'Forbidden Access';
    case Create = 'Create';
    case Upload = 'Upload';
    case Update = 'Update';
    case Delete = 'Delete';
    case Download = 'Download';
    case UploadAttachment = 'Upload Attachment';
    case DeleteAttachment = 'Delete Attachment';
}
