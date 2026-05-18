<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => '管理者',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_manager' => true,
            'email_verified_at' => now(),
            // 'remember_token' => null,
        ]);
        User::create([
            'name' => 'テストユーザー',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'is_manager' => false,
            'email_verified_at' => now(),
            // 'remember_token' => null,
        ]);

        User::factory()->count(10)->create();
    }
}
