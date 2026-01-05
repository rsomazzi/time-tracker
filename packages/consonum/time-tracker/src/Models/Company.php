<?php

namespace Consonum\TimeTracker\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Consonum\TimeTracker\Models\Concerns\HasTablePrefix;

class Company extends Model
{
    use HasTablePrefix;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'address',
        'city',
        'postal_code',
        'country',
        'phone',
        'email',
        'website',
        'vat_number',
    ];

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }
}
