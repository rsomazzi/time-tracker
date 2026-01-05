<?php

namespace Consonum\TimeTracker\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Consonum\TimeTracker\Models\Project;
use Consonum\TimeTracker\Models\ActiveTimer;
use Consonum\TimeTracker\Models\TimeEntry;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Fetch active projects with categories
        $projects = Project::with('categories')
            ->active()
            ->orderBy('name')
            ->get();

        // Fetch active timer if any
        $activeTimer = ActiveTimer::with(['project', 'category'])
            ->where('user_id', $user->id)
            ->first();

        // Fetch today's entries
        $todayEntries = TimeEntry::with(['project', 'category'])
            ->where('user_id', $user->id)
            ->whereDate('date', today())
            ->orderBy('start_time', 'desc')
            ->get();

        return Inertia::render('TimeTracker/Dashboard', [
            'projects' => $projects,
            'activeTimer' => $activeTimer,
            'todayEntries' => $todayEntries,
        ]);
    }
}
