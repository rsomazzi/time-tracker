<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Time Tracker Route Prefix
    |--------------------------------------------------------------------------
    |
    | This prefix will be applied to all Time Tracker routes.
    | Set to null or empty string for no prefix.
    |
    */
    'route_prefix' => 'time-tracker',

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    |
    | These middleware will be applied to Time Tracker routes.
    |
    */
    'middleware' => ['web', 'auth'],

    /*
    |--------------------------------------------------------------------------
    | User Model
    |--------------------------------------------------------------------------
    |
    | The user model that Time Tracker should use.
    |
    */
    'user_model' => \App\Models\User::class,

    /*
    |--------------------------------------------------------------------------
    | Database Table Prefix
    |--------------------------------------------------------------------------
    |
    | Prefix for all Time Tracker database tables.
    |
    */
    'table_prefix' => 'tt_',

    /*
    |--------------------------------------------------------------------------
    | Use Package Migrations
    |--------------------------------------------------------------------------
    |
    | Set to false if you want to publish and customize migrations.
    |
    */
    'use_package_migrations' => true,

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    |
    | Default currency for rates and amounts.
    |
    */
    'currency' => 'CHF',

    /*
    |--------------------------------------------------------------------------
    | Default Hourly Rate
    |--------------------------------------------------------------------------
    |
    | Default hourly rate for new projects.
    |
    */
    'default_hourly_rate' => 150.00,

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    |
    | Enable or disable specific features.
    |
    */
    'features' => [
        'timer' => true,
        'reports' => true,
        'export_csv' => true,
        'companies' => true,
        'customers' => true,
    ],
];
