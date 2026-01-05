<?php

namespace Consonum\TimeTracker\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Consonum\TimeTracker\Models\Concerns\HasTablePrefix;

class TimeEntry extends Model
{
    use HasTablePrefix;

    protected $table = 'time_entries';

    protected $fillable = [
        'user_id',
        'project_id',
        'category_id',
        'date',
        'start_time',
        'end_time',
        'duration_hours',
        'hourly_rate',
        'total_amount',
        'description',
        'status',
        'invoice_id',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration_hours' => 'decimal:4',
        'hourly_rate' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($entry) {
            // Auto-calculate duration and total
            if ($entry->start_time && $entry->end_time) {
                $start = $entry->start_time instanceof \Carbon\Carbon
                    ? $entry->start_time
                    : \Carbon\Carbon::parse($entry->start_time);
                $end = $entry->end_time instanceof \Carbon\Carbon
                    ? $entry->end_time
                    : \Carbon\Carbon::parse($entry->end_time);

                $entry->duration_hours = $start->diffInSeconds($end) / 3600;
            }

            if ($entry->duration_hours && $entry->hourly_rate) {
                $entry->total_amount = $entry->duration_hours * $entry->hourly_rate;
            }
        });
    }

    public function user(): BelongsTo
    {
        $userModel = config('time-tracker.user_model', \App\Models\User::class);
        return $this->belongsTo($userModel);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeForProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }
}
