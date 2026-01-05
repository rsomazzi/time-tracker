<?php

namespace Consonum\TimeTracker\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Consonum\TimeTracker\Models\Concerns\HasTablePrefix;

class Customer extends Model
{
    use HasTablePrefix;

    protected $table = 'customers';

    protected $fillable = [
        'company_id',
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'country',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
