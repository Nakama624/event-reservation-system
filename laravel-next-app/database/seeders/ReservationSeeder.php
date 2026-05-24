<?php

namespace Database\Seeders;

use App\Models\Reservation;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Reservation::create([
            'user_id' => 2,
            'schedule_id' => 2,
            'contact_number' => '0123456789',
            'participants' => 2,
            'amount' => 2000,
            'payment_status' => '支払済み',
            'payment_method_id' => 1,
            'paid_at' => now(),
            'is_canceled' => false,
        ]);

        Reservation::create([
            'user_id' => 2,
            'schedule_id' => 4,
            'contact_number' => '0123334444',
            'participants' => 3,
            'amount' => 3000,
            'payment_status' => '未払い',
            'payment_method_id' => 2,
            'paid_at' => now(),
            'is_canceled' => true,
        ]);
        Reservation::create([
            'user_id' => 2,
            'schedule_id' => 5,
            'contact_number' => '0124445555',
            'participants' => 3,
            'amount' => 3000,
            'payment_status' => '未払い',
            'payment_method_id' => 1,
            'paid_at' => now(),
            'is_canceled' => false,
        ]);
        Reservation::create([
            'user_id' => 5,
            'schedule_id' => 2,
            'contact_number' => '0128889999',
            'participants' => 3,
            'amount' => 3000,
            'payment_status' => '未払い',
            'payment_method_id' => 2,
            'payment_updated_by' => 1,
            'paid_at' => null,
            'is_canceled' => false,
        ]);

        Reservation::create([
            'user_id' => 3,
            'schedule_id' => 4,
            'contact_number' => '01200001111',
            'participants' => 2,
            'amount' => 2800,
            'payment_status' => '支払済み',
            'payment_method_id' => 2,
            'paid_at' => now(),
            'is_canceled' => false,
        ]);

    }
}
