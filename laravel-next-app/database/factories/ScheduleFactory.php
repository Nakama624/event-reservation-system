<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScheduleFactory extends Factory
{
    public function definition(): array
    {
        // 開始日時（2026年のランダム日付）
        $start = Carbon::instance(
            fake()->dateTimeBetween('2025-12-01', '2026-12-31')
        );

        // 開始時間をランダム調整
        $start->setTime(
            fake()->numberBetween(9, 18),
            fake()->randomElement([0, 30]),
            0
        );

        // 1〜3時間後を終了時間に
        $finish = (clone $start)->addHours(
            fake()->numberBetween(2, 3)
        );

        return [
            // Eventが1〜100件ある想定
            'event_id' => fake()->numberBetween(1, 104),

            'start_at' => $start,
            'finish_at' => $finish,
        ];
    }
}
