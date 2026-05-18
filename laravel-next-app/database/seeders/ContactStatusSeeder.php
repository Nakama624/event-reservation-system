<?php

namespace Database\Seeders;

use App\Models\ContactStatus;
use Illuminate\Database\Seeder;

class ContactStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ContactStatus::create([
            'status' => '未対応',
        ]);

        ContactStatus::create([
            'status' => '対応中',
        ]);

        ContactStatus::create([
            'status' => '対応済み',  // 現金を想定
        ]);
    }
}
