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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->string('contact_number');
            $table->unsignedInteger('participants');
            $table->unsignedInteger('amount');
            $table->string('payment_status')->default('未払い');
            $table->foreignId('payment_method_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_updated_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->dateTime('paid_at')->nullable();
            $table->boolean('is_canceled')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
