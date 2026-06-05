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
        ContactStatus::updateOrCreate(
            ['id' => 1],
            ['status' => '未対応']
        );

        ContactStatus::updateOrCreate(
            ['id' => 2],
            ['status' => '対応中']
        );

        ContactStatus::updateOrCreate(
            ['id' => 3],
            ['status' => '対応済み']
        );
    }
}
