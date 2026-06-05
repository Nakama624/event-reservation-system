<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ContactStatusFactory extends Factory
{
    public function definition(): array
    {
        return [
            'status' => '未対応',
        ];
    }
}