# Consonum Time Tracker

A modular time tracking package for Laravel 12 with Inertia.js and React.

## Features

- Timer with start/stop/pause functionality
- Project and category management
- Time entry reports with filtering
- CSV export
- Configurable table prefix
- Works standalone or as a module in existing Laravel apps

## Installation

### As a Local Package (Development)

1. Add the package repository to your `composer.json`:

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

2. Require the package:

```bash
composer require consonum/time-tracker
```

3. Publish configuration (optional):

```bash
php artisan vendor:publish --tag=time-tracker-config
```

4. Run migrations:

```bash
php artisan migrate
```

### As a Composer Package

```bash
composer require consonum/time-tracker
```

## Configuration

Publish the config file:

```bash
php artisan vendor:publish --tag=time-tracker-config
```

Available options in `config/time-tracker.php`:

```php
return [
    // Route prefix (e.g., /time-tracker)
    'route_prefix' => 'time-tracker',

    // Middleware for routes
    'middleware' => ['web', 'auth'],

    // User model
    'user_model' => \App\Models\User::class,

    // Database table prefix
    'table_prefix' => 'tt_',

    // Default currency
    'currency' => 'CHF',

    // Default hourly rate
    'default_hourly_rate' => 150.00,

    // Feature flags
    'features' => [
        'timer' => true,
        'reports' => true,
        'export_csv' => true,
    ],
];
```

## Usage

### Add Time Tracking to User Model

Add the `HasTimeTracking` trait to your User model:

```php
use Consonum\TimeTracker\Traits\HasTimeTracking;

class User extends Authenticatable
{
    use HasTimeTracking;
}
```

This gives you:
- `$user->timeEntries` - All time entries
- `$user->activeTimer` - Current active timer
- `$user->todayEntries` - Today's entries
- `$user->todayHours` - Total hours today
- `$user->weekHours` - Total hours this week
- `$user->monthHours` - Total hours this month

### Accessing Time Tracker

After installation, access the time tracker at:
- Dashboard: `/time-tracker`
- Reports: `/time-tracker/reports`

### Customizing React Components

Publish the React components for customization:

```bash
php artisan vendor:publish --tag=time-tracker-components
```

Components will be published to `resources/js/vendor/time-tracker/`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /time-tracker | Dashboard |
| POST | /time-tracker/timer/start | Start timer |
| POST | /time-tracker/timer/stop | Stop timer |
| POST | /time-tracker/timer/pause | Pause timer |
| POST | /time-tracker/timer/resume | Resume timer |
| GET | /time-tracker/reports | Reports page |
| GET | /time-tracker/entries | List entries (API) |
| POST | /time-tracker/entries | Create entry |
| PUT | /time-tracker/entries/{id} | Update entry |
| DELETE | /time-tracker/entries/{id} | Delete entry |

## Database Schema

The package creates the following tables (with configurable prefix):

- `tt_companies` - Company information
- `tt_customers` - Customer information
- `tt_projects` - Projects with hourly rates
- `tt_categories` - Project categories
- `tt_time_entries` - Time tracking entries
- `tt_active_timers` - Active timer sessions

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Quick Start Guide](docs/QUICKSTART.md) - Get up and running quickly
- [Timer Guide](docs/TIMER_GUIDE.md) - Complete timer functionality reference
- [Reports Guide](docs/REPORTS_GUIDE.md) - Reports and time entry management
- [UAT Test Plan](docs/UAT_TEST_PLAN.md) - User acceptance testing procedures

## License

MIT License
