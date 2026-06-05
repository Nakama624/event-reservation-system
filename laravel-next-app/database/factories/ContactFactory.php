<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ContactStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status_id' => ContactStatus::factory(),
            'title' => fake()->sentence(),
            'detail' => fake()->paragraph(),
        ];
    }
}