<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return HasMany<UserMapping, $this>
     */
    public function userMappings(): HasMany
    {
        return $this->hasMany(UserMapping::class);
    }

    /**
     * @return HasMany<IomDocument, $this>
     */
    public function documents(): HasMany
    {
        return $this->hasMany(IomDocument::class);
    }
}
