<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contact::create([
            'user_id' => 2,
            'title' => '予約時間について',
            'detail' => '予約時間について予約時間について予約時間について予約時間について',
            'status_id' => '1',
        ]);
        Contact::create([
            'user_id' => 2,
            'title' => 'XXXXXXX',
            'detail' => 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            'status_id' => '2',
        ]);
        Contact::create([
            'user_id' => 2,
            'title' => 'AAAAAAAAAAAA対応済みテスト',
            'detail' => 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAあ',
            'status_id' => '3',
        ]);
        Contact::create([
            'user_id' => 3,
            'title' => 'AAAAAAAAAAAA',
            'detail' => 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAあ',
            'status_id' => '1',
        ]);
    }
}
