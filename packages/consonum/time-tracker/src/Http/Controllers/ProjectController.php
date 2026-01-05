<?php

namespace Consonum\TimeTracker\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Consonum\TimeTracker\Models\Project;
use Consonum\TimeTracker\Models\Category;

class ProjectController extends Controller
{
    public function categories(int $projectId)
    {
        $project = Project::findOrFail($projectId);

        $categories = $project->categories()
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }
}
