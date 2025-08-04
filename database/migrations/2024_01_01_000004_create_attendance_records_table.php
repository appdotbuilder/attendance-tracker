<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['check_in', 'check_out']);
            $table->timestamp('recorded_at');
            $table->decimal('latitude', 10, 8)->nullable()->comment('GPS latitude coordinate');
            $table->decimal('longitude', 11, 8)->nullable()->comment('GPS longitude coordinate');
            $table->string('location_address')->nullable()->comment('Human readable address');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'recorded_at']);
            $table->index(['type', 'recorded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};