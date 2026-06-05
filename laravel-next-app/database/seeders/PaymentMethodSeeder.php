<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PaymentMethod::updateOrCreate(
            ['id' => 1],
            ['payment_method' => 'クレジットカード']
        );

        PaymentMethod::updateOrCreate(
            ['id' => 2],
            ['payment_method' => '現地払い']
        );

    }
}
