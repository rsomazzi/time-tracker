<?php

namespace Consonum\TimeTracker\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Consonum\TimeTracker\Models\Concerns\HasTablePrefix;

class Project extends Model
{
    use HasTablePrefix;

    protected $table = 'projects';

    protected $fillable = [
        'customer_id',
        'name',
        'code',
        'description',
        'color',
        'department',
        'hourly_rate',
        'status',
        'start_date',
        'end_date',
        'budget_hours',
        'budget_amount',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'budget_hours' => 'decimal:2',
        'budget_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class)->orderBy('sort_order');
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function activeTimers(): HasMany
    {
        return $this->hasMany(ActiveTimer::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function getTotalHoursAttribute(): float
    {
        return $this->timeEntries()->sum('duration_hours');
    }

    public function getTotalAmountAttribute(): float
    {
        return $this->timeEntries()->sum('total_amount');
    }
}
