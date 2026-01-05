<?php

namespace Consonum\TimeTracker\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Consonum\TimeTracker\Models\Concerns\HasTablePrefix;
use Carbon\Carbon;

class ActiveTimer extends Model
{
    use HasTablePrefix;

    protected $table = 'active_timers';

    protected $fillable = [
        'user_id',
        'project_id',
        'category_id',
        'started_at',
        'paused_at',
        'paused_duration',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'paused_at' => 'datetime',
        'paused_duration' => 'integer',
    ];

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

    public function getElapsedSecondsAttribute(): int
    {
        $startTime = $this->started_at;
        $pausedDuration = $this->paused_duration ?? 0;

        if ($this->status === 'paused' && $this->paused_at) {
            return $this->paused_at->diffInSeconds($startTime) - $pausedDuration;
        }

        return now()->diffInSeconds($startTime) - $pausedDuration;
    }

    public function getElapsedHoursAttribute(): float
    {
        return $this->elapsed_seconds / 3600;
    }

    public function pause(): self
    {
        $this->update([
            'status' => 'paused',
            'paused_at' => now(),
        ]);

        return $this;
    }

    public function resume(): self
    {
        if ($this->status === 'paused' && $this->paused_at) {
            $additionalPause = now()->diffInSeconds($this->paused_at);

            $this->update([
                'status' => 'running',
                'paused_at' => null,
                'paused_duration' => $this->paused_duration + $additionalPause,
            ]);
        }

        return $this;
    }

    public function stop(string $description = null): TimeEntry
    {
        // If paused, resume first to calculate final duration
        if ($this->status === 'paused' && $this->paused_at) {
            $additionalPause = now()->diffInSeconds($this->paused_at);
            $this->paused_duration += $additionalPause;
        }

        $durationSeconds = now()->diffInSeconds($this->started_at) - $this->paused_duration;
        $durationHours = $durationSeconds / 3600;

        $entry = TimeEntry::create([
            'user_id' => $this->user_id,
            'project_id' => $this->project_id,
            'category_id' => $this->category_id,
            'date' => $this->started_at->toDateString(),
            'start_time' => $this->started_at,
            'end_time' => now(),
            'duration_hours' => $durationHours,
            'hourly_rate' => $this->project->hourly_rate ?? 0,
            'description' => $description,
            'status' => 'completed',
        ]);

        $this->delete();

        return $entry;
    }
}
