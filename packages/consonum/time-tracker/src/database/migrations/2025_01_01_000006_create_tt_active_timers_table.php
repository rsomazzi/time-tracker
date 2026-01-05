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

        Schema::create($prefix . 'active_timers', function (Blueprint $table) use ($prefix, $userTable) {
            $table->id();
            $table->foreignId('user_id')->constrained($userTable)->cascadeOnDelete();
            $table->foreignId('project_id')->constrained($prefix . 'projects')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained($prefix . 'categories')->nullOnDelete();
            $table->timestamp('started_at');
            $table->timestamp('paused_at')->nullable();
            $table->integer('paused_duration')->default(0); // seconds
            $table->enum('status', ['running', 'paused'])->default('running');
            $table->timestamps();

            $table->unique('user_id'); // Only one active timer per user
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(config('time-tracker.table_prefix', 'tt_') . 'active_timers');
    }
};
