# Consonum Business Suite

A collection of modular Laravel packages for small business operations.

## Architecture

This project uses a modular architecture where each business application is a standalone Laravel package that can:
- Run independently as its own Laravel application
- Be integrated as a module in a larger Laravel application
- Be published to Packagist for distribution

## Applications

### Time Tracker
**Status:** Complete
**Location:** `packages/consonum/time-tracker`

A buzzer-style time tracking application with:
- Timer start/stop/pause/resume functionality
- Project and category management
- Time entry reports with filtering
- CSV export for invoicing
- Multi-tenant support via table prefixes

[View Documentation](packages/consonum/time-tracker/README.md)

### CRM (Planned)
**Status:** Planned
**Location:** `packages/consonum/crm`

Customer relationship management:
- Contact management
- Communication history
- Deal tracking
- Task management

### Inventory (Planned)
**Status:** Planned
**Location:** `packages/consonum/inventory`

Simple inventory management:
- Product catalog
- Stock tracking
- Low stock alerts
- Supplier management

### Workflows (Planned)
**Status:** Planned
**Location:** `packages/consonum/workflows`

Simple workflow automation:
- Task templates
- Approval workflows
- Status tracking
- Notifications

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

# Run with coverage
php artisan test --coverage

# Lint PHP code
./vendor/bin/pint
```

### Database

```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Reset specific package tables
php artisan migrate:refresh --path=packages/consonum/time-tracker/src/database/migrations
```

## Package Development

Each package follows this structure:

```
packages/consonum/[package-name]/
├── composer.json           # Package metadata
├── README.md              # Package documentation
├── docs/                  # Detailed documentation
└── src/
    ├── config/            # Package configuration
    ├── database/
    │   ├── migrations/    # Database migrations
    │   └── seeders/       # Test data seeders
    ├── Http/Controllers/  # API controllers
    ├── Models/            # Eloquent models
    ├── Providers/         # Service provider
    ├── Traits/            # Reusable traits
    └── routes/            # Route definitions
```

### Creating a New Package

1. Create the package structure in `packages/consonum/[name]`
2. Add repository to main `composer.json`
3. Require the package: `composer require consonum/[name]`
4. Package auto-discovers via service provider

### Publishing Packages

Each package can be published to its own GitHub repository and Packagist:

```bash
# From package directory
git init
git remote add origin git@github.com:consonum/[package-name].git
git push -u origin main
```

## Project Structure

```
time-tracker-laravel/
├── app/
│   └── Models/User.php    # Extended with package traits
├── packages/
│   └── consonum/
│       └── time-tracker/  # Time Tracker package
├── resources/
│   └── js/
│       ├── Components/    # React components
│       └── Pages/         # Inertia pages
├── database/
│   └── seeders/           # Main seeders (call package seeders)
└── routes/
    └── web.php            # Auth routes, package routes auto-load
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
