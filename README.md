# Consonum Time Tracker

A buzzer-style time tracking application built with Laravel 12, Inertia.js, and React.

## Features

- **Buzzer-style timer** - One-click start on any category
- **Auto task switching** - Previous task auto-saves when switching
- **Pause/Resume** - Temporarily stop without ending entry
- **Real-time display** - Live HH:MM:SS countdown
- **Reports** - Filter by date range and project
- **CSV Export** - Download for invoicing/spreadsheets
- **Multi-tenant ready** - Configurable table prefix

## Tech Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** React 19 with TypeScript
- **Bridge:** Inertia.js 2.0
- **Styling:** Tailwind CSS 4.0
- **Build:** Vite 7.0
- **Testing:** PHPUnit
- **Linting:** Pint (PHP)

## Quick Start

```bash
# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate --seed

# Build assets
npm run build

# Start development servers
composer dev
```

Access at: http://localhost:8000

**Demo Login:**
- Email: demo@example.com
- Password: password

## Development

### Running the Application

```bash
# All services (recommended)
composer dev

# Individual services
php artisan serve          # Laravel server
npm run dev                # Vite dev server
php artisan queue:listen   # Queue worker
php artisan pail           # Log viewer
```

### Testing

```bash
# Run all tests
php artisan test

# Lint PHP code
./vendor/bin/pint
```

### Database

```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed
```

## Project Structure

```
time-tracker/
├── app/
│   └── Models/User.php         # User with HasTimeTracking trait
├── packages/
│   └── consonum/
│       └── time-tracker/       # Core package (installable separately)
│           ├── src/
│           │   ├── Http/Controllers/
│           │   ├── Models/
│           │   ├── database/migrations/
│           │   └── routes/
│           └── docs/
├── resources/js/
│   ├── Components/TimeTracker/ # React components
│   └── Pages/TimeTracker/      # Dashboard & Reports pages
└── routes/web.php              # Auth routes
```

## Using as Installable Package

The core time tracking functionality is in `packages/consonum/time-tracker` and can be installed in other Laravel projects:

```bash
composer require consonum/time-tracker
```

See [Package Documentation](packages/consonum/time-tracker/README.md) for installation instructions.

## Routes

| Route | Description |
|-------|-------------|
| `/time-tracker` | Dashboard with timer and project cards |
| `/time-tracker/reports` | Reports with filtering and export |
| `/time-tracker/timer/*` | Timer API endpoints |
| `/time-tracker/entries/*` | Time entry CRUD endpoints |

## Documentation

- [Package README](packages/consonum/time-tracker/README.md) - Installation & API reference
- [Quick Start Guide](packages/consonum/time-tracker/docs/QUICKSTART.md)
- [Timer Guide](packages/consonum/time-tracker/docs/TIMER_GUIDE.md)
- [Reports Guide](packages/consonum/time-tracker/docs/REPORTS_GUIDE.md)
- [UAT Test Plan](packages/consonum/time-tracker/docs/UAT_TEST_PLAN.md)

## License

MIT License - see [LICENSE](packages/consonum/time-tracker/LICENSE) file.

## Credits

Developed by [Consonum GmbH](https://consonum.ch)

Part of the [Consonum Business Suite](../README.md).
