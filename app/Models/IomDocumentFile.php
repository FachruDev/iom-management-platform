<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class IomDocumentFile extends Model
{
    use HasFactory;
    use HasUlids;
    use SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'iom_document_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'extension',
        'size',
    ];

    /**
     * @return BelongsTo<IomDocument, $this>
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(IomDocument::class, 'iom_document_id');
    }
}
