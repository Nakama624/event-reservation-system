<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    /**
     * イベント一覧を取得できる
     */
    public function test_user_can_get_event_list()
    {
        $event = Event::factory()->create([
            'title' => '英会話レッスン',
        ]);

        Schedule::factory()->create([
            'event_id' => $event->id,
            'start_at' => now()->addDay(),
            'finish_at' => now()->addDay()->addHour(),
        ]);

        $response = $this->getJson('/api/event/list');

        $response->assertStatus(200);
    }

    /**
     * 過去イベント一覧を取得できる
     */
    public function test_user_can_get_past_event_list()
    {
        $event = Event::factory()->create([
            'title' => '過去のイベント',
        ]);

        Schedule::factory()->create([
            'event_id' => $event->id,
            'start_at' => now()->subDay(),
            'finish_at' => now()->subDay()->addHour(),
        ]);

        $response = $this->getJson('/api/past-event/list');

        $response->assertStatus(200);
    }

    /**
     * イベント詳細を取得できる
     */
    public function test_user_can_get_event_detail()
    {
        $event = Event::factory()->create([
            'title' => 'ヨガレッスン',
        ]);

        $schedule = Schedule::factory()->create([
            'event_id' => $event->id,
            'start_at' => now()->addDay(),
            'finish_at' => now()->addDay()->addHour(),
        ]);

        $response = $this->getJson("/api/event/{$schedule->id}");

        $response->assertStatus(200);
    }

    /**
     * キーワード検索でイベントを絞り込める
     */
    public function test_user_can_filter_events_by_keyword()
    {
        $targetEvent = Event::factory()->create([
            'title' => '英会話レッスン',
        ]);

        $otherEvent = Event::factory()->create([
            'title' => 'ヨガレッスン',
        ]);

        Schedule::factory()->create([
            'event_id' => $targetEvent->id,
            'start_at' => now()->addDay(),
            'finish_at' => now()->addDay()->addHour(),
        ]);

        Schedule::factory()->create([
            'event_id' => $otherEvent->id,
            'start_at' => now()->addDay(),
            'finish_at' => now()->addDay()->addHour(),
        ]);

        $response = $this->getJson('/api/event/list?keyword=英会話');

        $response->assertStatus(200);

        // 検索対象は含まれる
        $response->assertJsonFragment([
            'title' => '英会話レッスン',
        ]);

        // 対象外は含まれない
        $response->assertJsonMissing([
            'title' => 'ヨガレッスン',
        ]);
    }
    /**
     * 日付検索でイベントを絞り込める
     */
    public function test_user_can_filter_events_by_date()
    {
        $targetDate = now()->addDays(3)->format('Y-m-d');

        $targetEvent1 = Event::factory()->create([
            'title' => '英会話レッスン',
        ]);

        $targetEvent2 = Event::factory()->create([
            'title' => 'ヨガ教室',
        ]);

        $otherEvent = Event::factory()->create([
            'title' => '別日イベント',
        ]);

        // 同日イベント1
        Schedule::factory()->create([
            'event_id' => $targetEvent1->id,
            'start_at' => $targetDate . ' 10:00:00',
            'finish_at' => $targetDate . ' 11:00:00',
        ]);

        // 同日イベント2
        Schedule::factory()->create([
            'event_id' => $targetEvent2->id,
            'start_at' => $targetDate . ' 15:00:00',
            'finish_at' => $targetDate . ' 16:00:00',
        ]);

        // 別日イベント
        Schedule::factory()->create([
            'event_id' => $otherEvent->id,
            'start_at' => now()->addDays(5),
            'finish_at' => now()->addDays(5)->addHour(),
        ]);

        $response = $this->getJson("/api/event/list?date={$targetDate}");

        $response->assertStatus(200);

        // 検索対象は含まれる
        $response->assertJsonFragment([
            'title' => '英会話レッスン',
        ]);

        $response->assertJsonFragment([
            'title' => 'ヨガ教室',
        ]);

        // 別日は含まれない
        $response->assertJsonMissing([
            'title' => '別日イベント',
        ]);
    }
}