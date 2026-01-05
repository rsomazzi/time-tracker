<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $prefix = config('time-tracker.table_prefix', 'tt_');

        Schema::create($prefix . 'categories', function (Blueprint $table) use ($prefix) {
            $table->id();
            $table->foreignId('project_id')->constrained($prefix . 'projects')->cascadeOnDelete();
            $table->string('code', 20);
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_billable')->default(true);
            $table->timestamps();

            $table->unique(['project_id', 'code']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(config('time-tracker.table_prefix', 'tt_') . 'categories');
    }
};
