<?php

namespace Consonum\TimeTracker\Traits;

use Consonum\TimeTracker\Models\ActiveTimer;
use Consonum\TimeTracker\Models\TimeEntry;

/**
 * Trait to add to User model for time tracking capabilities.
 */
trait HasTimeTracking
{
    public function timeEntries()
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function activeTimer()
    {
        return $this->hasOne(ActiveTimer::class);
    }

    public function getTodayEntriesAttribute()
    {
        return $this->timeEntries()
            ->whereDate('date', today())
            ->with(['project', 'category'])
            ->orderBy('start_time', 'desc')
            ->get();
    }

    public function getTodayHoursAttribute(): float
    {
        return $this->timeEntries()
            ->whereDate('date', today())
            ->sum('duration_hours');
    }

    public function getWeekHoursAttribute(): float
    {
        return $this->timeEntries()
            ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
            ->sum('duration_hours');
    }

    public function getMonthHoursAttribute(): float
    {
        return $this->timeEntries()
            ->whereBetween('date', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('duration_hours');
    }
}
