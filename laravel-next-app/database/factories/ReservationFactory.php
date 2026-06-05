<?php

namespace Database\Factories;

use App\Models\PaymentMethod;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'schedule_id' => Schedule::factory(),
            'participants' => 1,
            'contact_number' => '09012345678',
            'amount' => 3000,
            'payment_status' => '未払い',
            'payment_method_id' => PaymentMethod::factory(),
            'is_canceled' => false,
        ];
    }
}