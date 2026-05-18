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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->unsignedInteger('capacity');
            $table->string('lesson_img1');
            $table->string('lesson_img2')->nullable();
            $table->string('lesson_img3')->nullable();
            $table->string('catch_copy');
            $table->string('instructor_name');
            $table->string('instructor_img')->nullable();
            $table->text('instructor_profile')->nullable();
            $table->unsignedInteger('price');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
