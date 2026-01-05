<?php

use Illuminate\Support\Facades\Route;
use Consonum\TimeTracker\Http\Controllers\DashboardController;
use Consonum\TimeTracker\Http\Controllers\TimerController;
use Consonum\TimeTracker\Http\Controllers\TimeEntryController;
use Consonum\TimeTracker\Http\Controllers\ProjectController;

$prefix = config('time-tracker.route_prefix', 'time-tracker');
$middleware = config('time-tracker.middleware', ['web', 'auth']);

Route::prefix($prefix)
    ->middleware($middleware)
    ->name('time-tracker.')
    ->group(function () {
        // Dashboard
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Timer API
        Route::post('/timer/start', [TimerController::class, 'start'])->name('timer.start');
        Route::post('/timer/stop', [TimerController::class, 'stop'])->name('timer.stop');
        Route::post('/timer/pause', [TimerController::class, 'pause'])->name('timer.pause');
        Route::post('/timer/resume', [TimerController::class, 'resume'])->name('timer.resume');

        // Reports
        Route::get('/reports', [TimeEntryController::class, 'index'])->name('reports');
        Route::get('/entries', [TimeEntryController::class, 'list'])->name('entries.list');

        // Time Entries CRUD
        Route::post('/entries', [TimeEntryController::class, 'store'])->name('entries.store');
        Route::put('/entries/{id}', [TimeEntryController::class, 'update'])->name('entries.update');
        Route::delete('/entries/{id}', [TimeEntryController::class, 'destroy'])->name('entries.destroy');

        // Projects
        Route::get('/projects/{id}/categories', [ProjectController::class, 'categories'])->name('projects.categories');
    });
