# Quick Start Guide

## Overview

The Consonum Time Tracker is a Laravel 12 package with Inertia.js and React for frontend. This guide will get you up and running quickly.

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL or SQLite database

## Installation

### 1. Install Dependencies

```bash
composer install
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
php artisan key:generate
```

Configure your database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=time_tracker
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Run Migrations

```bash
php artisan migrate
```

### 4. Seed Test Data

```bash
php artisan db:seed
```

This creates:
- Demo user: `demo@example.com` / `password`
- Company: Consonum GmbH
- 2 Customers with 3 Projects
- Categories for each project

### 5. Build Frontend Assets

```bash
npm run build
```

Or for development with hot reload:

```bash
npm run dev
```

### 6. Start the Server

```bash
php artisan serve
```

Or use the development script that runs everything:

```bash
composer dev
```

This starts:
- Laravel server (http://localhost:8000)
- Queue listener
- Log viewer (Pail)
- Vite dev server

### 7. Login

1. Navigate to http://localhost:8000
2. Login with `demo@example.com` / `password`
3. You'll see the Time Tracker dashboard

## What You'll See

### Dashboard
- **Project Cards**: Grid of active projects with color-coded categories
- **Active Timer**: Shows when a timer is running with elapsed time
- **Today's Summary**: All time entries tracked today

### Reports Page
- Date range selection with shortcuts
- Filter by project
- Summary cards (hours, amount, rate)
- Time entries table with edit/delete
- CSV export

## Configuration

Publish the config file to customize:

```bash
php artisan vendor:publish --tag=time-tracker-config
```

Edit `config/time-tracker.php`:

```php
return [
    'route_prefix' => 'time-tracker',  // Change URL prefix
    'table_prefix' => 'tt_',           // Change table prefix
    'currency' => 'CHF',               // Change currency
    'default_hourly_rate' => 150.00,   // Default rate
];
```

## Adding Users

Create a new user and link to company:

```php
use App\Models\User;
use Consonum\TimeTracker\Models\Company;

$company = Company::first();

$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => bcrypt('password'),
]);

// Optional: Associate with company via relationship
```

## Next Steps

1. **Start tracking time**: Click any category button to start the timer
2. **View reports**: Navigate to `/time-tracker/reports`
3. **Export data**: Use the CSV export for invoicing
4. **Customize**: Publish and modify React components

## Common Issues

### "Class not found" errors
```bash
composer dump-autoload
```

### Frontend not loading
```bash
npm run build
```

### Database errors
```bash
php artisan migrate:fresh --seed
```

## Development Commands

| Command | Description |
|---------|-------------|
| `composer dev` | Start all dev servers |
| `npm run dev` | Start Vite dev server |
| `php artisan test` | Run tests |
| `./vendor/bin/pint` | Format code |
| `php artisan migrate:fresh --seed` | Reset database |

## Directory Structure

```
packages/consonum/time-tracker/
├── src/
│   ├── config/           # Package configuration
│   ├── Http/Controllers/ # API controllers
│   ├── Models/           # Eloquent models
│   ├── Providers/        # Service provider
│   ├── Traits/           # HasTimeTracking trait
│   ├── database/         # Migrations and seeders
│   └── routes/           # Web routes
└── docs/                 # Documentation
```

## Help

- See `TIMER_GUIDE.md` for timer functionality details
- See `REPORTS_GUIDE.md` for reports and exports
- See `UAT_TEST_PLAN.md` for testing procedures
