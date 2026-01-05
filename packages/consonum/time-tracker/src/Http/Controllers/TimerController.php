<?php

namespace Consonum\TimeTracker\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Consonum\TimeTracker\Models\Project;
use Consonum\TimeTracker\Models\ActiveTimer;
use Consonum\TimeTracker\Models\TimeEntry;

class TimerController extends Controller
{
    public function start(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:' . config('time-tracker.table_prefix') . 'projects,id',
            'category_id' => 'required|exists:' . config('time-tracker.table_prefix') . 'categories,id',
        ]);

        $user = $request->user();

        // Stop existing timer if any
        $existingTimer = ActiveTimer::where('user_id', $user->id)->first();
        if ($existingTimer) {
            $existingTimer->stop('Auto-saved when switching tasks');
        }

        // Start new timer
        $timer = ActiveTimer::create([
            'user_id' => $user->id,
            'project_id' => $request->project_id,
            'category_id' => $request->category_id,
            'started_at' => now(),
            'status' => 'running',
        ]);

        $timer->load(['project', 'category']);

        return response()->json([
            'timer' => $timer,
        ]);
    }

    public function stop(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();

        $timer = ActiveTimer::where('user_id', $user->id)->first();

        if (!$timer) {
            return response()->json([
                'error' => 'No active timer found',
            ], 404);
        }

        $entry = $timer->stop($request->description);
        $entry->load(['project', 'category']);

        return response()->json([
            'entry' => $entry,
        ]);
    }

    public function pause(Request $request)
    {
        $user = $request->user();

        $timer = ActiveTimer::where('user_id', $user->id)->first();

        if (!$timer) {
            return response()->json([
                'error' => 'No active timer found',
            ], 404);
        }

        if ($timer->status === 'paused') {
            return response()->json([
                'error' => 'Timer is already paused',
            ], 400);
        }

        $timer->pause();
        $timer->load(['project', 'category']);

        return response()->json([
            'timer' => $timer,
        ]);
    }

    public function resume(Request $request)
    {
        $user = $request->user();

        $timer = ActiveTimer::where('user_id', $user->id)->first();

        if (!$timer) {
            return response()->json([
                'error' => 'No active timer found',
            ], 404);
        }

        if ($timer->status === 'running') {
            return response()->json([
                'error' => 'Timer is already running',
            ], 400);
        }

        $timer->resume();
        $timer->load(['project', 'category']);

        return response()->json([
            'timer' => $timer,
        ]);
    }
}
