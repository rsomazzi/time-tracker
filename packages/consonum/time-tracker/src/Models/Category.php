<?php

namespace Consonum\TimeTracker\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Consonum\TimeTracker\Models\Concerns\HasTablePrefix;

class Category extends Model
{
    use HasTablePrefix;

    protected $table = 'categories';

    protected $fillable = [
        'project_id',
        'code',
        'name',
        'description',
        'sort_order',
        'is_billable',
    ];

    protected $casts = [
        'is_billable' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function activeTimers(): HasMany
    {
        return $this->hasMany(ActiveTimer::class);
    }
}
