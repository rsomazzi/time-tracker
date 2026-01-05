<?php

namespace Consonum\TimeTracker\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Consonum\TimeTracker\Models\Project;
use Consonum\TimeTracker\Models\TimeEntry;

class TimeEntryController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $projects = Project::with('customer:id,name')
            ->select('id', 'name', 'color', 'customer_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('TimeTracker/Reports', [
            'projects' => $projects,
        ]);
    }

    public function list(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'project_id' => 'nullable|exists:' . config('time-tracker.table_prefix') . 'projects,id',
        ]);

        $user = $request->user();

        $query = TimeEntry::with(['project', 'category'])
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc');

        if ($request->start_date) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->where('date', '<=', $request->end_date);
        }

        if ($request->project_id && $request->project_id !== 'all') {
            $query->where('project_id', $request->project_id);
        }

        $entries = $query->get();

        return response()->json([
            'entries' => $entries,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:' . config('time-tracker.table_prefix') . 'projects,id',
            'category_id' => 'nullable|exists:' . config('time-tracker.table_prefix') . 'categories,id',
            'date' => 'required|date',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date',
            'description' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $project = Project::findOrFail($request->project_id);

        $entry = TimeEntry::create([
            'user_id' => $user->id,
            'project_id' => $request->project_id,
            'category_id' => $request->category_id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'hourly_rate' => $project->hourly_rate,
            'description' => $request->description,
            'status' => $request->end_time ? 'completed' : 'draft',
        ]);

        $entry->load(['project', 'category']);

        return response()->json([
            'entry' => $entry,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $request->validate([
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date',
            'end_time' => 'nullable|date',
            'description' => 'nullable|string|max:1000',
            'duration_hours' => 'sometimes|numeric|min:0',
        ]);

        $user = $request->user();

        $entry = TimeEntry::where('user_id', $user->id)
            ->findOrFail($id);

        $entry->update($request->only([
            'date',
            'start_time',
            'end_time',
            'description',
            'duration_hours',
        ]));

        $entry->load(['project', 'category']);

        return response()->json([
            'entry' => $entry,
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();

        $entry = TimeEntry::where('user_id', $user->id)
            ->findOrFail($id);

        $entry->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}
