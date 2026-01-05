<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $prefix = config('time-tracker.table_prefix', 'tt_');

        Schema::create($prefix . 'customers', function (Blueprint $table) use ($prefix) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained($prefix . 'companies')->nullOnDelete();
            $table->string('name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->default('CH');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(config('time-tracker.table_prefix', 'tt_') . 'customers');
    }
};
