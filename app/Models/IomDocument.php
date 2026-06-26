<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class IomDocument extends Model
{
    use HasFactory;
    use HasUlids;
    use SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'iom_number',
        'department_id',
        'uploaded_by_id',
        'description',
    ];

    /**
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * @return BelongsTo<UserMapping, $this>
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(UserMapping::class, 'uploaded_by_id');
    }

    /**
     * @return HasMany<IomDocumentFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(IomDocumentFile::class);
    }
}
