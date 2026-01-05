<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $prefix = config('time-tracker.table_prefix', 'tt_');
        $userModel = config('time-tracker.user_model', \App\Models\User::class);
        $userTable = (new $userModel)->getTable();

        Schema::create($prefix . 'time_entries', function (Blueprint $table) use ($prefix, $userTable) {
            $table->id();
            $table->foreignId('user_id')->constrained($userTable)->cascadeOnDelete();
            $table->foreignId('project_id')->constrained($prefix . 'projects')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained($prefix . 'categories')->nullOnDelete();
            $table->date('date');
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->decimal('duration_hours', 8, 4)->default(0);
            $table->decimal('hourly_rate', 10, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'completed', 'invoiced'])->default('completed');
            $table->foreignId('invoice_id')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'date']);
            $table->index(['project_id', 'date']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(config('time-tracker.table_prefix', 'tt_') . 'time_entries');
    }
};
