<?php

namespace Database\Seeders;

use App\Models\Schedule;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schedule::create([
            'event_id' => 1,
            'start_at' => '2026-05-03 10:00:00',
            'finish_at' => '2026-05-03 12:00:00',
        ]);

        Schedule::create([
            'event_id' => 1,
            'start_at' => '2026-04-28 17:00:00',
            'finish_at' => '2026-04-28 19:00:00',
        ]);

        Schedule::create([
            'event_id' => 2,
            'start_at' => '2026-04-24 14:00:00',
            'finish_at' => '2026-04-24 15:00:00',
        ]);

        Schedule::create([
            'event_id' => 2,
            'start_at' => '2026-06-10 17:00:00',
            'finish_at' => '2026-06-10 18:00:00',
        ]);

        Schedule::create([
            'event_id' => 3,
            'start_at' => '2026-06-18 17:00:00',
            'finish_at' => '2026-06-18 18:00:00',
        ]);

        Schedule::create([
            'event_id' => 4,
            'start_at' => '2026-04-18 10:00:00',
            'finish_at' => '2026-04-18 11:00:00',
        ]);
        Schedule::create([
            'event_id' => 4,
            'start_at' => '2026-06-20 10:00:00',
            'finish_at' => '2026-06-20 11:00:00',
        ]);
        Schedule::factory()->count(100)->create();
    }
}
