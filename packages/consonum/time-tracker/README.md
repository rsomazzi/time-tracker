# Consonum Time Tracker

A modular, buzzer-style time tracking package for Laravel 12 with Inertia.js and React frontend.

[![Latest Version](https://img.shields.io/packagist/v/consonum/time-tracker.svg?style=flat-square)](https://packagist.org/packages/consonum/time-tracker)
[![License](https://img.shields.io/packagist/l/consonum/time-tracker.svg?style=flat-square)](https://packagist.org/packages/consonum/time-tracker)

## Features

- **Buzzer-style timer** - One-click start on any category
- **Auto task switching** - Previous task auto-saves when switching
- **Pause/Resume** - Temporarily stop without ending entry
- **Real-time display** - Live HH:MM:SS countdown
- **Reports** - Filter by date range and project
- **CSV Export** - Download for invoicing/spreadsheets
- **Multi-tenant ready** - Configurable table prefix
- **Standalone or integrated** - Works as main app or module

## Requirements

- PHP 8.2+
- Laravel 11.x or 12.x
- Inertia.js 2.0+
- React 18+ or 19+
- Node.js 18+

## Installation

### Option 1: Install from GitHub (Recommended)

Add the repository to your `composer.json`:

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/consonum/time-tracker"
        }
    ]
}
```

Then require the package:

```bash
composer require consonum/time-tracker:dev-main
```

### Option 2: Install from Packagist

Once published to Packagist:

```bash
composer require consonum/time-tracker
```

### Option 3: Local Development

Clone or copy the package to `packages/consonum/time-tracker`, then add to `composer.json`:

```json
{
    "repositories": [
        {
            "type": "path",
            "url": "packages/consonum/time-tracker"
        }
    ]
}
```

```bash
composer require consonum/time-tracker:@dev
```

## Setup

### 1. Run Migrations

```bash
php artisan migrate
```

This creates the following tables (with `tt_` prefix by default):
- `tt_companies` - Company information
- `tt_customers` - Customer records
- `tt_projects` - Projects with hourly rates
- `tt_categories` - Project categories
- `tt_time_entries` - Time tracking entries
- `tt_active_timers` - Active timer sessions

### 2. Add Trait to User Model

Add the `HasTimeTracking` trait to your User model:

```php
<?php

namespace App\Models;

use Consonum\TimeTracker\Traits\HasTimeTracking;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasTimeTracking;

    // ... rest of your model
}
```

This provides:
- `$user->timeEntries` - All time entries relationship
- `$user->activeTimer` - Current active timer (one per user)
- `$user->today_entries` - Today's entries with eager loading
- `$user->today_hours` - Total hours tracked today
- `$user->week_hours` - Total hours this week
- `$user->month_hours` - Total hours this month

### 3. Publish Configuration (Optional)

```bash
php artisan vendor:publish --tag=time-tracker-config
```

### 4. Setup Frontend Components

The package includes React components. Copy them to your resources:

```bash
php artisan vendor:publish --tag=time-tracker-components
```

Or manually copy from `vendor/consonum/time-tracker/resources/js/` to your `resources/js/`.

**Required npm packages:**

```bash
npm install @inertiajs/react react react-dom
```

### 5. Seed Test Data (Optional)

```bash
php artisan db:seed --class="Consonum\TimeTracker\Database\Seeders\TimeTrackerSeeder"
```

## Configuration

After publishing, edit `config/time-tracker.php`:

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    |
    | The URL prefix for all time tracker routes.
    | Default: /time-tracker, /time-tracker/reports, etc.
    |
    */
    'route_prefix' => 'time-tracker',

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    |
    | Middleware applied to all time tracker routes.
    | Add your own middleware for additional security.
    |
    */
    'middleware' => ['web', 'auth'],

    /*
    |--------------------------------------------------------------------------
    | User Model
    |--------------------------------------------------------------------------
    |
    | The user model class. Must use HasTimeTracking trait.
    |
    */
    'user_model' => \App\Models\User::class,

    /*
    |--------------------------------------------------------------------------
    | Database Table Prefix
    |--------------------------------------------------------------------------
    |
    | Prefix for all time tracker tables.
    | Useful for multi-tenant or avoiding conflicts.
    |
    */
    'table_prefix' => 'tt_',

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | Default currency for amounts.
    |
    */
    'currency' => 'CHF',

    /*
    |--------------------------------------------------------------------------
    | Default Hourly Rate
    |--------------------------------------------------------------------------
    |
    | Default rate for new projects (can be overridden per project).
    |
    */
    'default_hourly_rate' => 150.00,

    /*
    |--------------------------------------------------------------------------
    | Feature Flags
    |--------------------------------------------------------------------------
    |
    | Enable or disable specific features.
    |
    */
    'features' => [
        'timer' => true,           // Timer functionality
        'reports' => true,         // Reports page
        'export_csv' => true,      // CSV export button
        'companies' => true,       // Company management
        'customers' => true,       // Customer management
    ],
];
```

## Usage

### Access the Application

After installation, access at:
- **Dashboard:** `/time-tracker`
- **Reports:** `/time-tracker/reports`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/time-tracker` | Dashboard page |
| POST | `/time-tracker/timer/start` | Start timer |
| POST | `/time-tracker/timer/stop` | Stop timer and create entry |
| POST | `/time-tracker/timer/pause` | Pause running timer |
| POST | `/time-tracker/timer/resume` | Resume paused timer |
| GET | `/time-tracker/reports` | Reports page |
| GET | `/time-tracker/entries` | List entries (JSON) |
| POST | `/time-tracker/entries` | Create entry |
| PUT | `/time-tracker/entries/{id}` | Update entry |
| DELETE | `/time-tracker/entries/{id}` | Delete entry |
| GET | `/time-tracker/projects/{id}/categories` | Get project categories |

### Programmatic Usage

```php
use Consonum\TimeTracker\Models\Project;
use Consonum\TimeTracker\Models\TimeEntry;

// Get active projects
$projects = Project::active()->with('categories')->get();

// Get user's entries for a date range
$entries = $user->timeEntries()
    ->whereBetween('date', [$startDate, $endDate])
    ->with(['project', 'category'])
    ->get();

// Check if user has active timer
if ($user->activeTimer) {
    $elapsed = $user->activeTimer->elapsed_hours;
}

// Create a time entry manually
$entry = TimeEntry::create([
    'user_id' => $user->id,
    'project_id' => $project->id,
    'category_id' => $category->id,
    'date' => now()->toDateString(),
    'start_time' => now()->subHours(2),
    'end_time' => now(),
    'description' => 'Development work',
    'hourly_rate' => 150.00,
]);
// duration_hours and total_amount are auto-calculated
```

## Frontend Integration

### Inertia.js Setup

Ensure your `app.tsx` or `app.js` includes Inertia setup:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

### Component Structure

```
resources/js/
├── Pages/
│   └── TimeTracker/
│       ├── Dashboard.tsx      # Main dashboard
│       └── Reports.tsx        # Reports page
└── Components/
    └── TimeTracker/
        ├── ActiveTimer.tsx    # Timer display
        ├── ProjectCard.tsx    # Project with categories
        ├── TodaySummary.tsx   # Today's entries
        ├── StopTimerModal.tsx # Stop timer dialog
        ├── DateRangeSelector.tsx
        ├── ReportSummary.tsx
        └── TimeEntriesTable.tsx
```

### TypeScript Types

```typescript
// resources/js/types/index.ts
export interface Project {
    id: string;
    name: string;
    code: string;
    color: string;
    department?: string;
    hourly_rate: number;
    categories: Category[];
}

export interface Category {
    id: string;
    project_id: string;
    code: string;
    name: string;
    sort_order: number;
}

export interface TimeEntry {
    id: string;
    user_id: string;
    project_id: string;
    category_id?: string;
    date: string;
    start_time: string;
    end_time?: string;
    duration_hours?: number;
    hourly_rate: number;
    total_amount?: number;
    description?: string;
    project?: Project;
    category?: Category;
}

export interface ActiveTimer {
    id: string;
    user_id: string;
    project_id: string;
    category_id?: string;
    started_at: string;
    paused_at?: string;
    paused_duration: number;
    status: 'running' | 'paused';
    project?: Project;
    category?: Category;
}
```

## Customization

### Custom Route Prefix

```php
// config/time-tracker.php
'route_prefix' => 'tracking',  // Now at /tracking
```

### Custom Table Prefix

```php
// config/time-tracker.php
'table_prefix' => 'myapp_',  // Tables: myapp_projects, myapp_time_entries, etc.
```

**Note:** Change prefix before running migrations.

### Additional Middleware

```php
// config/time-tracker.php
'middleware' => ['web', 'auth', 'verified', 'my-custom-middleware'],
```

## Troubleshooting

### "Class not found" errors

```bash
composer dump-autoload
php artisan optimize:clear
```

### Routes not working

```bash
php artisan route:list --path=time-tracker
```

### Migrations fail

Check table prefix doesn't conflict:
```bash
php artisan migrate:status
```

### Frontend not loading

1. Ensure npm packages installed: `npm install`
2. Build assets: `npm run build`
3. Check Inertia middleware is registered

## Documentation

- [Quick Start Guide](docs/QUICKSTART.md)
- [Timer Guide](docs/TIMER_GUIDE.md)
- [Reports Guide](docs/REPORTS_GUIDE.md)
- [UAT Test Plan](docs/UAT_TEST_PLAN.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `php artisan test`
5. Submit a pull request

## License

MIT License. See [LICENSE](LICENSE) file.

## Credits

Developed by [Consonum GmbH](https://consonum.ch)
