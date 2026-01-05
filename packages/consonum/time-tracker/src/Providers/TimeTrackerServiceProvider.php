<?php

namespace Consonum\TimeTracker\Providers;

use Illuminate\Support\ServiceProvider;

class TimeTrackerServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/time-tracker.php',
            'time-tracker'
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPublishing();
        $this->registerRoutes();
        $this->registerMigrations();
    }

    /**
     * Register the package's publishable resources.
     */
    protected function registerPublishing(): void
    {
        if ($this->app->runningInConsole()) {
            // Config
            $this->publishes([
                __DIR__.'/../config/time-tracker.php' => config_path('time-tracker.php'),
            ], 'time-tracker-config');

            // Migrations
            $this->publishes([
                __DIR__.'/../database/migrations/' => database_path('migrations'),
            ], 'time-tracker-migrations');

            // React Components (for customization)
            $this->publishes([
                __DIR__.'/../resources/js/' => resource_path('js/vendor/time-tracker'),
            ], 'time-tracker-components');
        }
    }

    /**
     * Register the package routes.
     */
    protected function registerRoutes(): void
    {
        $prefix = config('time-tracker.route_prefix', 'time-tracker');
        $middleware = config('time-tracker.middleware', ['web', 'auth']);

        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
    }

    /**
     * Register the package migrations.
     */
    protected function registerMigrations(): void
    {
        if (config('time-tracker.use_package_migrations', true)) {
            $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        }
    }

    /**
     * Get the table name with prefix.
     */
    public static function tableName(string $name): string
    {
        return config('time-tracker.table_prefix', 'tt_') . $name;
    }
}
