<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $prefix = config('time-tracker.table_prefix', 'tt_');

        Schema::create($prefix . 'projects', function (Blueprint $table) use ($prefix) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained($prefix . 'customers')->nullOnDelete();
            $table->string('name');
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->string('color')->default('#3B82F6');
            $table->string('department')->nullable();
            $table->decimal('hourly_rate', 10, 2)->default(config('time-tracker.default_hourly_rate', 150.00));
            $table->enum('status', ['active', 'inactive', 'completed'])->default('active');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget_hours', 10, 2)->nullable();
            $table->decimal('budget_amount', 12, 2)->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(config('time-tracker.table_prefix', 'tt_') . 'projects');
    }
};
